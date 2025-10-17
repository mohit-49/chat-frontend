"use client";

import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ProtectedRoute from "../../components/ProtectedRoute"; 

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div style={{ padding: "2rem" }}>
        <ChatWindow />
      </div>
    </ProtectedRoute>
  );
}
