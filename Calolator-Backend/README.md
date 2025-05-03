# Calolator - Backend API

Đây là phần backend API cho ứng dụng web Calolator. Backend được xây dựng bằng FastAPI (Python) và có nhiệm vụ chính là:

1.  Tiếp nhận yêu cầu gợi ý thực đơn (dưới dạng prompt chứa số calo hoặc mô tả khác) từ frontend.
2.  Sử dụng model ngôn ngữ lớn **Vinallama 7B đã được finetune** (sử dụng PEFT/LoRA và lượng tử hóa 4-bit) để tạo ra gợi ý thực đơn phù hợp.
3.  Trả kết quả thực đơn về cho frontend.

Backend này được thiết kế để chạy trên môi trường có GPU NVIDIA hỗ trợ CUDA để tận dụng tối đa hiệu năng của model và thư viện `bitsandbytes` cho lượng tử hóa 4-bit.

## Tính năng chính

- **API Endpoint `/suggest-menu` (POST):** Nhận prompt từ người dùng và trả về gợi ý thực đơn do AI tạo ra.
- **AI Model Integration:** Tải và chạy model `vilm/vinallama-7b-chat` đã được finetune với adapter PEFT `thanhdat2004/MealCaloCalculator_vinallama_chunk5`.
- **4-bit Quantization:** Sử dụng `bitsandbytes` để lượng tử hóa model, giảm yêu cầu VRAM và tăng tốc độ inference trên GPU tương thích.
- **CORS Configuration:** Cho phép frontend (chạy trên domain/port khác) gọi đến API.

## Công nghệ sử dụng

- **Python:** Ngôn ngữ lập trình chính.
- **FastAPI:** Framework web hiệu năng cao để xây dựng API.
- **Uvicorn:** ASGI server để chạy ứng dụng FastAPI.
- **Transformers (Hugging Face):** Thư viện để tải và làm việc với model ngôn ngữ.
- **PEFT (Hugging Face):** Thư viện để tải và áp dụng Parameter-Efficient Fine-Tuning adapters (LoRA).
- **BitsandBytes:** Thư viện cho phép lượng tử hóa model (4-bit/8-bit) để chạy trên GPU.
- **PyTorch:** Framework Deep Learning làm nền tảng cho model.
- **Accelerate (Hugging Face):** Hỗ trợ tải và chạy model lớn trên nhiều thiết bị, tối ưu bộ nhớ.
- **python-dotenv:** Quản lý biến môi trường từ file `.env`.

## Model Information

- **Base Model:** `vilm/vinallama-7b-chat`
- **PEFT Adapter:** `thanhdat2004/MealCaloCalculator_vinallama_chunk5` (LoRA)
- **Quantization:** 4-bit (NF4) thông qua `bitsandbytes`.

## Điều kiện tiên quyết

Trước khi chạy backend, bạn cần đảm bảo môi trường của bạn đáp ứng các yêu cầu sau:

- **Python:** Phiên bản 3.10 hoặc 3.11 được khuyến nghị (do khả năng tương thích tốt hơn với các thư viện ML).
- **Pip & Venv:** Trình quản lý gói và môi trường ảo của Python.
- **NVIDIA GPU:** Cần có GPU NVIDIA hỗ trợ CUDA.
- **CUDA Toolkit:** Phiên bản CUDA tương thích với PyTorch và `bitsandbytes` đã được cài đặt. (Kiểm tra phiên bản PyTorch bạn đang cài).
- **NVIDIA Driver:** Driver GPU phù hợp đã được cài đặt.
- **Hệ điều hành:** **Linux (Ubuntu khuyến nghị) hoặc Windows với WSL2** được **ưu tiên cao** do `bitsandbytes` hỗ trợ GPU tốt nhất trên các môi trường này. Chạy trực tiếp trên Windows gốc có thể gặp vấn đề với việc biên dịch `bitsandbytes` hỗ trợ GPU.
- **Git:** Để clone repository (nếu cần).

## Cài đặt

1.  **Clone Repository (Nếu cần):**

    ```bash
    git clone <your-backend-repo-url>
    cd <your-backend-repo-directory>
    ```

2.  **Tạo và Kích hoạt Môi trường ảo:**

    ```bash
    python -m venv venv
    # Trên Linux/macOS/WSL2
    source venv/bin/activate
    # Trên Windows (Command Prompt)
    .\venv\Scripts\activate
    # Trên Windows (PowerShell)
    .\venv\Scripts\Activate.ps1
    ```

3.  **Cài đặt Dependencies:**
    Đảm bảo file `requirements.txt` của bạn chứa tất cả các thư viện cần thiết (bao gồm `fastapi[standard]`, `transformers`, `torch`, `accelerate`, `peft`, `bitsandbytes`, `python-dotenv`, `scipy`).
    ```bash
    pip install -r requirements.txt
    ```

## Cấu hình

- Ứng dụng sử dụng file `.env` để quản lý các đường dẫn model (tùy chọn, vì code hiện tại có giá trị mặc định).
- Tạo file `.env` trong thư mục gốc của backend nếu bạn muốn ghi đè đường dẫn mặc định:

  ```dotenv
  # Tùy chọn: Ghi đè đường dẫn nếu model/adapter được lưu cục bộ
  # BASE_MODEL_PATH=vilm/vinallama-7b-chat
  # PEFT_ADAPTER_PATH=thanhdat2004/MealCaloCalculator_vinallama_chunk5

  # Tùy chọn: Thêm các biến môi trường khác nếu cần
  ```

- **Lưu ý:** Không commit file `.env` lên Git.

## Chạy Server Backend

Có hai kịch bản chính để chạy backend:

**1. Chạy trên Máy Local (Có GPU, Khuyến nghị Linux/WSL2):**

- **Yêu cầu:** Máy tính có GPU NVIDIA đủ VRAM (ít nhất 12-16GB cho 7B 4-bit), RAM hệ thống lớn (>= 32GB), và môi trường Linux/WSL2 đã cài đặt CUDA/driver đúng cách.
- **Khởi động Server (Development):**
  ```bash
  fastapi dev main.py --port 8000
  ```
  Hoặc dùng Uvicorn trực tiếp:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
  ```
- Server sẽ khởi động, tải model (có thể mất vài phút lần đầu) và sẵn sàng nhận yêu cầu tại `http://localhost:8000`.
- **Expose ra ngoài (Nếu cần):** Sử dụng `ngrok` hoặc cấu hình port forwarding trên router để frontend có thể truy cập từ bên ngoài nếu chạy trên máy khác.
  ```bash
  ngrok http 8000
  ```

**2. Chạy trên Google Colab (Nếu không có GPU):**

- **Cách làm:** Đây là giải pháp miễn phí tận dụng GPU của Colab.
  1.  Mở Google Colab, đảm bảo đã chọn Runtime type là **GPU (T4)**.
  2.  Upload file `main.py`, `.env` và `requirements.txt` lên Colab (hoặc mount Google Drive).
  3.  Chạy file `calolator_backend.ipynb`.
  4.  Script sẽ tải model (mất thời gian), khởi động FastAPI và in ra một URL `ngrok` công khai (ví dụ: `https://<random-string>.ngrok-free.app`).
- **Lưu ý:**
  - URL `ngrok` là **tạm thời** và sẽ thay đổi mỗi khi bạn chạy lại notebook. Cần cập nhật URL này vào frontend.
  - Phiên Colab có **giới hạn thời gian** và có thể bị ngắt. Cần chạy lại nếu bị ngắt kết nối.

## API Endpoint

- **`POST /suggest-menu`**:
  - **Request Body (JSON):**
    ```json
    {
      "prompt": "Nội dung yêu cầu của người dùng, ví dụ: thực đơn 1800 calo"
    }
    ```
  - **Response Body (JSON):**
    ```json
    {
      "reply": "Câu trả lời do AI tạo ra (chuỗi gợi ý thực đơn)"
    }
    ```
