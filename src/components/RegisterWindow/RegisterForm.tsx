"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import "./RegisterForm.css";
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useLoader } from "@/components/LoaderContext";

export default function RegisterForm() {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex = /^[A-Z](?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,}$/;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();
    if (!name.trim()) {
      toast.error("Name is required!");
      return;
    }
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters!");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email!");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must start with an uppercase letter, contain at least one number, one special symbol, and be 8+ characters long."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registered Successfully.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <form className="signup-form" onSubmit={handleRegister}>
          <div className={`signup-avatar ${avatar ? "" : "empty"}`}>
            {avatar ? (
              <img src={URL.createObjectURL(avatar)} alt="Avatar" />
            ) : (
              <span>Upload Avatar</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="avatar-input"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="signup-input"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="signup-input"
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
            />
          </div>

          <div className="input-password-group">
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </span>
          </div>

          <button type="submit" className="signup-button">
            Register
          </button>

          <p className="login-text" onClick={() => router.push("/login")}>
            Already have an account? <span>Signin</span>
          </p>

          <div className="signup-socials">
            <IconButton size="small"><i className="ri-facebook-fill" /></IconButton>
            <IconButton size="small"><i className="ri-twitter-fill" /></IconButton>
            <IconButton size="small"><i className="ri-github-fill" /></IconButton>
            <IconButton size="small"><i className="ri-google-fill" /></IconButton>
          </div>

        </form>
      </div>

      <div className="signup-info">
        <h1>Create Account</h1>
        <p>
          Join now and start chatting with your friends and family. Safe, secure, and easy to use.
        </p>   
         <p>
          Join now and start chatting with your friends and family. Safe, secure, and easy to use.
        </p> 
         <p>
          Join now and start chatting with your friends and family. Safe, secure, and easy to use.
        </p> 
            
      </div>
    </div>
  );
}
