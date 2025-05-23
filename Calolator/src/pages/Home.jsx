import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  createUserMessage,
  getBotReply,
  addChatToHistory,
} from "../utils/chatUtils";
import {
  fetchChatsByUserId,
  updateChat,
  deleteChatFromFirestore,
} from "../services/chat";
import {
  Bars3Icon,
  PaperAirplaneIcon,
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pastChats, setPastChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // --- Authentication Effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userChats = await fetchChatsByUserId(currentUser.uid);
          const sortedChats = userChats.sort(
            (a, b) => new Date(b.time) - new Date(a.time),
          );
          setPastChats(sortedChats);
        } catch (error) {
          console.error("Failed to fetch chats:", error);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- Scroll to Bottom Effect ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isBotTyping]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setMessage("");
    setActiveChatId(null);
    setIsBotTyping(false);
    console.log("Starting a new chat session.");
  };

  const handleLoadChat = (chatId) => {
    const chatToLoad = pastChats.find((chat) => chat.id === chatId);
    if (chatToLoad) {
      setChatHistory(chatToLoad.messages);
      setActiveChatId(chatId);
      setMessage("");
      setIsBotTyping(false);
    }
  };

  // --- Delete conversation ---
  const handleDeleteChat = async (chatIdToDelete, event) => {
    event.stopPropagation();
    if (!user?.uid || !chatIdToDelete) return;

    if (
      window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?")
    ) {
      try {
        const result = await deleteChatFromFirestore(user.uid, chatIdToDelete);
        if (result.success) {
          setPastChats((prevChats) =>
            prevChats.filter((chat) => chat.id !== chatIdToDelete),
          );

          if (activeChatId === chatIdToDelete) {
            handleNewChat();
          }
          console.log(`Chat ${chatIdToDelete} deleted successfully.`);
        } else {
          console.error("Failed to delete chat:", result.error);
          alert(
            `Lỗi khi xóa cuộc trò chuyện: ${result.error || "Lỗi không xác định"}`,
          );
        }
      } catch (error) {
        console.error("Error deleting chat:", error);
        alert("Đã xảy ra lỗi trong quá trình xóa.");
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isBotTyping || !user?.uid) return;

    const userMessage = createUserMessage(message);
    const updatedHistory = [...chatHistory, userMessage];
    const isNewChat = !activeChatId;
    const tentativeTitle =
      message.substring(0, 30) + (message.length > 30 ? "..." : "");
    const time = new Date();

    setChatHistory(updatedHistory);
    setMessage("");
    setIsBotTyping(true);

    try {
      const botReply = await getBotReply(message);
      const finalHistory = [...updatedHistory, botReply];

      setChatHistory(finalHistory);

      const result = await updateChat(user.uid, activeChatId, {
        messages: finalHistory,
        timeUpdate: time,
        ...(isNewChat && { title: tentativeTitle }),
      });

      if (result.success) {
        const newChatId = result.chatId;
        const finalTitle = result.title || tentativeTitle;

        addChatToHistory(
          newChatId,
          finalTitle,
          finalHistory,
          time,
          setPastChats,
        );

        if (isNewChat) {
          setActiveChatId(newChatId);
        }
      } else {
        console.error("Failed to update or create chat in Firebase.");
        alert("Lỗi khi lưu cuộc trò chuyện.");
        setChatHistory(updatedHistory);
      }
    } catch (error) {
      console.error("Error getting bot reply or updating chat:", error);
      alert("Đã xảy ra lỗi khi gửi tin nhắn hoặc nhận phản hồi.");
      setChatHistory(updatedHistory);
    } finally {
      setIsBotTyping(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-sky-100 to-indigo-200">
        <p className="text-xl text-gray-700">Loading Calolator...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-sky-100">
      {/* Sidebar */}
      <div
        className={` ${isSidebarOpen ? "w-64 md:w-72" : "w-0"} container flex flex-shrink-0 flex-col overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 text-white transition-all duration-300 ease-in-out`}
      >
        {/* Inner container */}
        <div className="flex h-full flex-col overflow-hidden p-4">
          {/* Sidebar Header */}
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="mr-2 overflow-hidden text-2xl font-semibold whitespace-nowrap">
              Calolator
            </h1>
            <button
              onClick={toggleSidebar}
              className="flex-shrink-0 cursor-pointer p-1 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="focus:ring-opacity-50 mb-4 flex w-full flex-shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-emerald-600 p-2.5 whitespace-nowrap text-white transition hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <PlusIcon className="h-5 w-5 flex-shrink-0" />
            New Chat
          </button>

          {/* Past Chats Section */}
          <div className="flex-grow overflow-x-hidden overflow-y-auto pr-1">
            <h2 className="mb-2 overflow-hidden text-xs font-semibold tracking-wider whitespace-nowrap text-gray-400 uppercase">
              History
            </h2>
            <ul>
              {pastChats.map((chat) => (
                <li
                  key={chat.id}
                  className="group relative mb-1 flex items-center"
                >
                  {" "}
                  <button
                    onClick={() => handleLoadChat(chat.id)}
                    title={chat.title}
                    className={`flex-grow truncate rounded-md p-2 text-left text-sm transition duration-150 ease-in-out ${
                      activeChatId === chat.id
                        ? "bg-gray-700 pr-8 font-medium"
                        : "pr-8 text-gray-300 hover:bg-gray-700/50"
                    }`}
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={(event) => handleDeleteChat(chat.id, event)}
                    title="Xóa cuộc trò chuyện"
                    className="absolute right-1 p-1 text-gray-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:text-red-400"
                    style={{
                      display: activeChatId === chat.id ? "none" : "block",
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  {activeChatId === chat.id && (
                    <button
                      onClick={(event) => handleDeleteChat(chat.id, event)}
                      title="Xóa cuộc trò chuyện này"
                      className="absolute right-1 p-1 text-gray-400 transition-colors hover:text-red-400"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
              {pastChats.length === 0 && (
                <li className="px-2 py-1 text-sm text-gray-500">
                  No chat history yet.
                </li>
              )}
            </ul>
          </div>

          {/* Footer Section */}
          <div className="mt-auto flex-shrink-0 border-t border-gray-700 pt-4">
            {user && (
              <div className="mb-3 flex items-center gap-2 overflow-hidden text-sm text-gray-400">
                <span className="truncate" title={user.email}>
                  {user.email}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="focus:ring-opacity-50 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-rose-600 p-2.5 whitespace-nowrap text-white transition hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <ArrowRightStartOnRectangleIcon className="h-5 w-5 flex-shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col bg-white shadow-inner">
        {/* Header for Chat Area */}
        <div className="flex flex-shrink-0 items-center border-b border-gray-200 p-3 md:p-4">
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="mr-3 cursor-pointer p-1 text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          <h2 className="flex-grow truncate text-lg font-medium text-gray-700">
            {activeChatId
              ? (pastChats.find((c) => c.id === activeChatId)?.title ?? "Chat")
              : "New Chat"}
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-xl px-4 py-2 shadow-md md:max-w-md lg:max-w-lg xl:max-w-2xl ${
                  chat.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <ReactMarkdown>{chat.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs rounded-xl bg-gray-200 px-4 py-2 text-gray-600 shadow-md">
                <span className="animate-pulse">Bot is typing...</span>
              </div>
            </div>
          )}
          {chatHistory.length === 0 && !isBotTyping && (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <p className="text-lg font-semibold">Welcome to Calolator!</p>
              <p className="mt-2">
                How many calories are you aiming for today?
              </p>
              <p className="mt-1 text-sm">
                Type your goal below to get started.
              </p>
              {pastChats.length > 0 && (
                <p className="mt-4 text-sm">
                  Or select a previous chat from the history panel.
                </p>
              )}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-3 md:p-4">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Suggest meals for 1800 calories..."
              className="flex-1 rounded-lg border border-gray-300 p-3 transition duration-150 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              disabled={isBotTyping}
            />
            <button
              type="submit"
              className="focus:ring-opacity-50 cursor-pointer rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!message.trim() || isBotTyping}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
