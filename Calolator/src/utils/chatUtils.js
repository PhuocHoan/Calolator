const createUserMessage = (text) => ({
  sender: "user",
  text,
});

const getBotReply = async (userPrompt) => {
  console.log("Sending prompt to FastAPI backend:", userPrompt);
  const API_URL =
    import.meta.env.VITE_API_BACKEND_URL ||
    "https://a30a-34-125-142-222.ngrok-free.app/suggest-menu";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Unknown server error" }));
      console.error("API Error:", response.status, errorData);
      return {
        sender: "bot",
        text: `Sorry, I encountered an error: ${errorData.detail || response.statusText}`,
      };
    }

    const data = await response.json();

    console.log("Received reply from backend:", data.reply);

    return {
      sender: "bot",
      text: data.reply,
    };
  } catch (error) {
    console.error("Network or fetch error:", error);
    return {
      sender: "bot",
      text: "Sorry, I couldn't connect to the suggestion service. Please check your connection or try again later.",
    };
  }
};

const addChatToHistory = (chatId, title, messages, time, setPastChats) => {
  setPastChats((prev) => {
    const updatedChats = prev.filter((chat) => chat.id !== chatId);
    return [{ id: chatId, title, messages, time }, ...updatedChats].sort(
      (a, b) => new Date(b.time) - new Date(a.time),
    );
  });
};

export { createUserMessage, getBotReply, addChatToHistory };
