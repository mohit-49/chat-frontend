"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import "./LoginForm.css";
import { useAuth } from "@/context/AuthContext";
import IconButton from '@mui/material/IconButton'
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useLoader } from "@/components/LoaderContext";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { showLoader, hideLoader } = useLoader();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader()
    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.access_token;
      const user = res.data.user;

      if (token && user) {
        login(token, user);
        router.push("/chat");
      } else {
        // console.log("Token or user not found", res.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      hideLoader();
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">MY-CHAT</div>
        <form className="login-form">
          <h3 className="header-logo">Welcome to MY-CHAT <img src="/chat1.jpg" alt="logo img" /></h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <div className="password-field">
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </span>
          </div>

          <button type="submit" className="login-button" onClick={handleLogin}>
            Sign In
          </button>

        </form>
        <p className="forgot-text" onClick={() => router.push("/register")}>
          Create a account <span>Signup</span>
        </p>

        <p className="forgot-text" onClick={() => router.push("/")}>
          Forgot your password ?
        </p>

        <div className="social-icons">
          <IconButton size="small">
            <i className="ri-facebook-fill" style={{ color: "#1877F2", fontSize: "28px" }} />
          </IconButton>

          <IconButton size="small">
            <i className="ri-twitter-fill" style={{ color: "#1DA1F2", fontSize: "28px" }} />
          </IconButton>

          <IconButton size="small">
            <i className="ri-github-fill" style={{ color: "#333", fontSize: "28px" }} />
          </IconButton>

          <IconButton size="small">
            <i className="ri-google-fill" style={{ color: "#DB4437", fontSize: "28px" }} />
          </IconButton>

          <IconButton size="small">
            <i className="ri-google-fill" style={{ color: "#DB4437", fontSize: "28px" }} />
          </IconButton>
         
        </div>
      </div>
    </div>
  );
}
