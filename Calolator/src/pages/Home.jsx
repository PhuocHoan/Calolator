import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Bars3Icon,
  PaperAirplaneIcon,
  ArrowRightStartOnRectangleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Simulated past chat data (replace with actual data fetching later)
const simulatedPastChats = [
  {
    id: "chat1",
    title: "1500 Calorie Plan",
    messages: [
      { sender: "user", text: "Suggest meals for 1500 calories." },
      {
        sender: "bot",
        text: "Okay, for 1500 calories: Breakfast - Oatmeal with berries (300 cal), Lunch - Grilled chicken salad (500 cal), Dinner - Salmon with roasted vegetables (600 cal), Snack - Apple (100 cal).",
      },
    ],
  },
  {
    id: "chat2",
    title: "High Protein Meals",
    messages: [
      {
        sender: "user",
        text: "I need high protein options around 2000 calories.",
      },
      {
        sender: "bot",
        text: "Sure! For a high-protein 2000 calorie day: Breakfast - Greek yogurt with nuts (400 cal), Lunch - Lentil soup with whole-wheat bread (600 cal), Dinner - Steak with quinoa and broccoli (800 cal), Snacks - Protein shake, hard-boiled eggs (200 cal).",
      },
    ],
  },
  {
    id: "chat3",
    title: "Vegetarian Options",
    messages: [
      { sender: "user", text: "Vegetarian meals for 1800 calories?" },
      {
        sender: "bot",
        text: "Got it. How about: Breakfast - Tofu scramble (350 cal), Lunch - Black bean burgers (550 cal), Dinner - Lentil shepherd's pie (700 cal), Snacks - Fruit and nuts (200 cal).",
      },
    ],
  },
];

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Messages for the *active* chat
  const [isBotTyping, setIsBotTyping] = useState(false); // Loading state for bot response
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar visibility
  const [pastChats, setPastChats] = useState(simulatedPastChats); // List of past chats
  const [activeChatId, setActiveChatId] = useState(null); // ID of the currently loaded chat
  const navigate = useNavigate();
  const chatEndRef = useRef(null); // Ref for scrolling

  // --- Authentication Effect ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // --- TODO: Fetch past chats from Firebase for this user ---
        // For now, we keep using simulated data
        setPastChats(simulatedPastChats);
        // Optionally load the first chat or keep it empty
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
  }, [chatHistory, isBotTyping]); // Trigger scroll on new messages or typing indicator

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
    setActiveChatId(null); // Indicate it's a new, unsaved chat
    setIsBotTyping(false);
    console.log("Starting a new chat session.");
    // --- TODO: Create a new chat record in Firebase ---
  };

  const handleLoadChat = (chatId) => {
    // --- TODO: Replace with actual fetch if needed, or assume pastChats is up-to-date ---
    const chatToLoad = pastChats.find((chat) => chat.id === chatId);
    if (chatToLoad) {
      setChatHistory(chatToLoad.messages);
      setActiveChatId(chatId);
      setMessage(""); // Clear input when loading a chat
      setIsBotTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isBotTyping) return;

    const userMessage = {
      sender: "user",
      text: message,
    };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    const currentMessage = message; // Capture message before clearing
    setMessage("");
    setIsBotTyping(true); // Start loading indicator

    // --- TODO: Save userMessage to Firebase for the activeChatId (or create new chat if null) ---
    // --- TODO: Call the actual external API ---
    console.log("Sending message to API:", currentMessage);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    const apiResponse = {
      sender: "bot",
      text: `Okay, based on "${currentMessage}", here's a simulated recommendation: Breakfast - Scrambled Eggs (300kcal), Lunch - Tuna Salad Sandwich (500kcal), Dinner - Grilled Chicken Breast with Veggies (600kcal). Adjust portions as needed!`,
    };
    // --- End Simulation ---
    // --- TODO: Save apiResponse to Firebase for the activeChatId ---

    setChatHistory((prevHistory) => [...prevHistory, apiResponse]);
    setIsBotTyping(false); // Stop loading indicator

    // --- TODO: Update the title of the chat in pastChats if it's a new chat, based on the first message? ---
    // Example: If activeChatId was null, create a new entry in pastChats
    if (!activeChatId) {
      const newChatId = `chat${Date.now()}`; // Generate a temporary ID
      const newChatTitle = currentMessage.substring(0, 30) + "..."; // Generate a title
      setPastChats((prev) => [
        {
          id: newChatId,
          title: newChatTitle,
          messages: [...updatedHistory, apiResponse],
        },
        ...prev,
      ]);
      setActiveChatId(newChatId);
    } else {
      // Update existing chat in pastChats state (or rely on Firebase listener)
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
        {/* Inner container to handle padding and flex column, also needs overflow hidden */}
        <div className="flex h-full flex-col overflow-hidden p-4">
          {/* Sidebar Header */}
          <div className="mb-4 flex flex-shrink-0 items-center justify-between">
            <h1 className="mr-2 overflow-hidden text-2xl font-semibold whitespace-nowrap">
              Calolator
            </h1>
            {/* Close button */}
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
              {" "}
              History
            </h2>
            <ul>
              {pastChats.map((chat) => (
                <li key={chat.id} className="mb-1">
                  <button
                    onClick={() => handleLoadChat(chat.id)}
                    title={chat.title} // Add title attribute for tooltip when hovering
                    className={`w-full rounded-md p-2 text-left text-sm transition duration-150 ease-in-out ${
                      activeChatId === chat.id
                        ? "bg-gray-700 font-medium"
                        : "text-gray-300 hover:bg-gray-700/50"
                    } cursor-pointer truncate`}
                  >
                    {chat.title}
                  </button>
                </li>
              ))}
              {/* Placeholder if no past chats */}
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
                {" "}
                <span className="truncate" title={user.email}>
                  {user.email}
                </span>
              </div>
            )}
            {/* Logout Button */}
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
          {" "}
          {!isSidebarOpen && (
            // Open button
            <button
              onClick={toggleSidebar}
              className="mr-3 cursor-pointer p-1 text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          <h2 className="flex-grow truncate text-lg font-medium text-gray-700">
            {" "}
            {activeChatId
              ? (pastChats.find((c) => c.id === activeChatId)?.title ?? "Chat")
              : "New Chat"}
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {chatHistory.map((chat, index) => (
            <div
              key={index} // Consider using a more stable key if messages have IDs
              className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-xl px-4 py-2 shadow-md md:max-w-md lg:max-w-lg xl:max-w-2xl ${
                  chat.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {chat.text}
              </div>
            </div>
          ))}
          {/* Typing Indicator */}
          {isBotTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs rounded-xl bg-gray-200 px-4 py-2 text-gray-600 shadow-md">
                <span className="animate-pulse">Bot is typing...</span>
              </div>
            </div>
          )}
          {/* Placeholder when chat is empty */}
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
          {/* Dummy div to ensure scrolling works */}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-3 md:p-4">
          {" "}
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
              disabled={isBotTyping} // Disable input while bot is typing
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
