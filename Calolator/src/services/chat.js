import { db } from "./firebase";
import { collection, getDocs, doc } from "firebase/firestore";

export const fetchChatsByUserId = async (userId) => {
  const userRef = doc(db, "users", userId);  // Lấy document của người dùng
  const chatsRef = collection(userRef, "chats");  // Lấy subcollection "chats" của user

  const querySnapshot = await getDocs(chatsRef);

  const chats = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    chats.push({
      id: doc.id,
      title: data.title || "Untitled Chat",
      messages: data.messages || [],
    });
  });

  // log(chats); // In ra danh sách các cuộc trò chuyện
  console.log("Chats:", chats); // In ra danh sách các cuộc trò chuyện

  return chats;
};

