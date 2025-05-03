import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from dotenv import load_dotenv

load_dotenv()

# --- Cấu hình ---
BASE_MODEL_NAME_OR_PATH = os.getenv("BASE_MODEL_PATH", "vilm/vinallama-7b-chat")
PEFT_ADAPTER_NAME_OR_PATH = os.getenv("PEFT_ADAPTER_PATH", "thanhdat2004/MealCaloCalculator_vinallama_chunk5")

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {DEVICE}")

# --- Cấu hình Quantization ---
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16
)

# --- Cấu hình Generation ---
MAX_NEW_TOKENS = 512
DO_SAMPLE = True
TEMPERATURE = 0.7
TOP_K = 40
TOP_P = 0.9
REPETITION_PENALTY = 1.5

# --- Khởi tạo Model và Tokenizer ---
model = None
tokenizer = None
try:
    # 1. Tải Base Model với Quantization Config
    print(f"Loading base model: {BASE_MODEL_NAME_OR_PATH} with 4-bit quantization...")
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL_NAME_OR_PATH,
        quantization_config=bnb_config,
        device_map="auto", # Để accelerate tự động phân bổ
        trust_remote_code=True
    )
    print("Base model loaded.")

    # 2. Tải PEFT Adapter lên trên Base Model đã lượng tử hóa
    print(f"Loading PEFT adapter from: {PEFT_ADAPTER_NAME_OR_PATH}")
    model = PeftModel.from_pretrained(
        base_model,
        PEFT_ADAPTER_NAME_OR_PATH,
        is_trainable=False # Đặt là False cho inference
    )
    
    print("PEFT adapter loaded successfully.")

    # 3. Tải Tokenizer
    print(f"Loading tokenizer from adapter repo: {PEFT_ADAPTER_NAME_OR_PATH}")
    tokenizer = AutoTokenizer.from_pretrained(PEFT_ADAPTER_NAME_OR_PATH)

    tokenizer.pad_token = tokenizer.eos_token
    tokenizer.padding_side = "right"
    print("Tokenizer loaded and configured successfully.")

except Exception as e:
    print(f"Error loading model or adapter: {e}")
    model = None
    tokenizer = None
    raise SystemExit(f"Could not load model/adapter: {e}")


# --- Định nghĩa Input/Output Models (Pydantic) ---
class ChatRequest(BaseModel):
    prompt: str # Query thô từ user

class ChatResponse(BaseModel):
    reply: str # Phần trả lời đã được xử lý

# --- Khởi tạo FastAPI App ---
app = FastAPI(
    title="Calolator AI API",
    description="API for Vinallama meal planning (PEFT 4bit tuned).",
    version="0.1.2",
)

# --- Cấu hình CORS ---
origins = [
    "http://localhost:5173", # Frontend React (Vite)
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency để kiểm tra model đã load chưa ---
async def get_model_tokenizer():
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model is not available or failed to load.")
    return model, tokenizer

# --- API Endpoint ---
@app.post("/suggest-menu", response_model=ChatResponse)
async def suggest_menu(
    request: ChatRequest,
    model_tokenizer_pair: tuple = Depends(get_model_tokenizer)
):
    """
    Nhận prompt thô từ user, áp dụng template, và trả về gợi ý thực đơn.
    """
    current_model, current_tokenizer = model_tokenizer_pair
    user_query = request.prompt

    formatted_prompt = f"""<|im_start|>system
                        Bạn là chuyên gia dinh dưỡng AI. Hãy đưa ra DUY NHẤT MỘT thực đơn phù hợp<|im_end|>
                        <|im_start|>user
                        {user_query}<|im_end|>
                        <|im_start|>assistant
                        Thực đơn gợi ý:
                        """

    print(f"Formatted prompt being sent to model:\n{formatted_prompt}")

    try:
        inputs = current_tokenizer(formatted_prompt, return_tensors="pt").to(current_model.device)

        with torch.inference_mode():
            outputs = current_model.generate(
                **inputs,
                max_new_tokens=MAX_NEW_TOKENS,
                pad_token_id=current_tokenizer.eos_token_id,
                do_sample=DO_SAMPLE,
                temperature=TEMPERATURE,
                top_k=TOP_K,
                top_p=TOP_P,
                repetition_penalty=REPETITION_PENALTY
            )

        full_decoded_text = current_tokenizer.decode(outputs[0], skip_special_tokens=True)

        # Tách phần trả lời của assistant khỏi prompt template
        assistant_marker = "Thực đơn gợi ý:\n"
        reply_start_index = full_decoded_text.find(assistant_marker)
        if reply_start_index != -1:
            reply_text = full_decoded_text[reply_start_index + len(assistant_marker):].strip()
        else:
            user_query_in_output = f"<|im_start|>user\n{user_query}<|im_end|>"
            user_query_end_index = full_decoded_text.find(user_query_in_output)
            if user_query_end_index != -1:
                 after_user_query = full_decoded_text[user_query_end_index + len(user_query_in_output):]
                 assistant_response_start = after_user_query.find("<|im_start|>assistant")
                 if assistant_response_start != -1:
                     reply_text = after_user_query[assistant_response_start + len("<|im_start|>assistant"):].strip()
                     if reply_text.startswith(assistant_marker):
                         reply_text = reply_text[len(assistant_marker):].strip()
                 else:
                     reply_text = after_user_query.strip()

            else:
                 system_prompt_end = "<|im_end|>"
                 system_end_index = full_decoded_text.find(system_prompt_end)
                 if system_end_index != -1:
                      reply_text = full_decoded_text[system_end_index + len(system_prompt_end):].strip()
                 else:
                      reply_text = full_decoded_text

        print(f"Generated reply (processed): {reply_text}")
        return ChatResponse(reply=reply_text)

    except Exception as e:
        print(f"Error during generation: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error during generation: {str(e)}")