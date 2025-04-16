const createUserMessage = (text) => ({
  sender: "user",
  text,
});

const getBotReply = async (text) => {
  console.log("Sending message to API:", text);
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake delay

  return {
    sender: "bot",
    text: `Okay, based on "${text}", here's a simulated recommendation: Breakfast - Scrambled Eggs (300kcal), Lunch - Tuna Salad Sandwich (500kcal), Dinner - Grilled Chicken Breast with Veggies (600kcal). Adjust portions as needed!`,
  };
};

const addChatToHistory = (chatId, title, messages, time, setPastChats) => {
  setPastChats((prev) => {
    // Xoá chat cũ nếu đã tồn tại
    const updatedChats = prev.filter(chat => chat.id !== chatId);

    // Thêm chat mới vào đầu danh sách
    return [
      {
        id: chatId,
        title,
        messages,
        time,
      },
      ...updatedChats,
    ];
  }); // Sort by time
};


export { createUserMessage, getBotReply, addChatToHistory };