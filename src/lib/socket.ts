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
  });

  socket.on("connect_error", () => {
  });

  socket.on("disconnect", () => {
  });

  return socket;
};

export const getSocket = () => socket;
