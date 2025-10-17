"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import "./AddAccount.css";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useLoader } from "@/components/LoaderContext";

type AddAccountFormProps = {
  onSuccess?: () => void;
  onBack: () => void;
};

export default function AddAccountForm({ onSuccess, onBack }: AddAccountFormProps) {
  const { showLoader, hideLoader } = useLoader();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();

    if (!name.trim()) return toast.error("Name is required!");
    if (username.trim().length < 3) return toast.error("Username too short!");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Invalid email!");
    if (!passwordRegex.test(password))
      return toast.error("Password must be 8+ chars with upper, lower, number & symbol");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) formData.append("avatar", avatar);

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("New contact added successfully!");
      onSuccess ? onSuccess() : router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add account");
    } finally {
      hideLoader();
    }
  };

  return (
    <div className="add-account-container">
      <button onClick={onBack} className="back-btn"><i className="ri-arrow-left-line"></i></button>
      <p style={{ color: "#6366f1" }}>Add Account</p>
      <form onSubmit={handleAddAccount} className="add-account-form">
        <div className="avatar-box">
          {avatar && <img src={URL.createObjectURL(avatar)} alt="Avatar" />}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
          />
        </div>

        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="password-field">
          <input
            type={showPassword ? "password" : "text"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </span>
        </div>

        <button type="submit" className="register-button">Add Account</button>
      </form>
    </div>
  );
}
