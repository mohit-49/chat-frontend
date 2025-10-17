"use client";
import React from "react";

export default function Loader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderWidth: 8,
          borderStyle: "solid",
          borderRadius: "50%",
          borderTopColor: "#4f46e5",
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
          boxSizing: "border-box",
          animation: "loader-rotate 1s linear infinite",
        }}
      />
      <style>{`
        @keyframes loader-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
