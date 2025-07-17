import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider.jsx";
import io from "socket.io-client";
import useConversation from "../stateManage/useConversation.js";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(["gemini-bot"]);
  const { authUser } = useAuth();
  const { addMessage } = useConversation(); // Zustand function

  useEffect(() => {
    console.log("🔐 AuthUser:", authUser);

    if (!authUser) {
      if (socket) {
        socket.close();
        setSocket(null);
        console.log("🚫 No authUser, socket closed");
      }
      setOnlineUsers(["gemini-bot"]);
      return;
    }

    const backendURL = "";

    console.log("🔌 Connecting to:", backendURL);

    const newSocket = io(backendURL, {
      query: { userId: authUser.user._id },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
    });

    setSocket(newSocket);
    window.socket = newSocket; // Debugging in browser console

    newSocket.on("connect", () => {
      console.log("✅ Connected with ID:", newSocket.id);
      newSocket.emit("register", authUser.user._id); // if supported by backend
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Connect error:", error.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", reason);
    });

    newSocket.on("reconnect", (attempt) => {
      console.log("🔄 Reconnected:", attempt);
      newSocket.emit("register", authUser.user._id);
    });

    newSocket.on("receive-message", (message) => {
      console.log("📩 Real-time message:", message);
      addMessage(message); // Push to Zustand
    });

    newSocket.on("getOnlineUsers", (users) => {
      const updatedUsers = ["gemini-bot", ...users.filter((u) => u !== "gemini-bot")];
      setOnlineUsers(updatedUsers);
      console.log("🟢 Online users updated:", updatedUsers);
    });

    newSocket.on("error", (error) => {
      console.error("🚨 Socket error:", error);
    });

    return () => {
      if (newSocket) {
        newSocket.off("connect");
        newSocket.off("connect_error");
        newSocket.off("disconnect");
        newSocket.off("reconnect");
        newSocket.off("receive-message");
        newSocket.off("getOnlineUsers");
        newSocket.off("error");
        newSocket.close();
        console.log("🧹 Socket cleaned up");
      }
    };
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
