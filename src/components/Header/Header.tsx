"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLoader } from "../LoaderContext";
import { useAuth } from "@/context/AuthContext"; 
import "./Header.css";

export default function Header() {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const { user, logout } = useAuth();

  const handleNavigation = async (path: string) => {
    try {
      showLoader();
    
      await router.push(path);
    } finally {
      hideLoader();
    }
  };

  const handleLogout = async () => {
    try {
      showLoader();
      await logout(); 
      await router.push("/login");
    } finally {
      hideLoader();
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={() => handleNavigation("/")}>
          <img src="/logo.png" alt="logo img" />
        </div>

        <nav className="header-nav">
          <div className="header-auth">
            {!user ? (
              <>
                <button className="signin" onClick={() => handleNavigation("/login")}>
                  <i className="ri-login-circle-line"></i> Sign In
                </button>
                <button className="signup" onClick={() => handleNavigation("/register")}>
                  <i className="ri-user-add-line"></i> Sign Up
                </button>
              </>
            ) : (
              <button className="logout" onClick={handleLogout}>
                <i className="ri-logout-box-line"></i> Logout
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
