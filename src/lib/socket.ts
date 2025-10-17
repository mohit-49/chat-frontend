import { io, Socket } from "socket.io-client";
import { getToken } from "./auth";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (socket) return socket;

  const token = getToken();
  if (!token) throw new Error("No token found");

  socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/chats`, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    // console.log("Socket connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    // console.error("Socket error:", err.message);
  });

  socket.on("disconnect", (reason) => {
  // console.log("Socket disconnected:", reason);
});

  return socket;
};

export const getSocket = () => socket;
