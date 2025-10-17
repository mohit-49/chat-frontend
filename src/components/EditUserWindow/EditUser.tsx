"use client";
import React, { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import "./EditUser.css";
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";

interface EditUserProps {
  user: any;
  onClose: () => void;
  onUpdated?: (user: any) => void;
}

export default function EditUser({ user, onClose, onUpdated }: EditUserProps) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    about: "",
    birthday: "",
    height: "",
    weight: "",
    interests: [] as string[],
    name: "",
    username: "",
    email: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const token = getToken();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setForm({
        about: user.about || "",
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        birthday: user.birthday
          ? new Date(user.birthday).toISOString().slice(0, 10)
          : "",
        height: user.height ? String(user.height) : "",
        weight: user.weight ? String(user.weight) : "",
        interests: user.interests
          ? user.interests.map((i: any) => i._id || i)
          : [],
      });
    }
  }, [user]);

  const handleChange = (k: string, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Not authenticated");
    setSubmitting(true);

    try {
      const fd = new FormData();
      if (form.about) fd.append("about", form.about);
      if (form.name) fd.append("name", form.name);
      if (form.username) fd.append("username", form.username);
      if (form.email) fd.append("email", form.email);
      if (form.birthday) fd.append("birthday", form.birthday);
      if (form.height) fd.append("height", form.height);
      if (form.weight) fd.append("weight", form.weight);
      if (form.interests?.length)
        fd.append("interests", JSON.stringify(form.interests));
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data);
        toast.error(data.message || "Failed to update");
        return;
      }

      const newUser = data.data || data;

      // update global context
      login(token, newUser);

      if (onUpdated) onUpdated(newUser);

      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
<div className="modal-backdrop">
  <div className="edit-modal">
    {/* Header with title and close button */}
    <div className="edit-modal-header">
      <h2>Edit Profile</h2>
      <button className="close-btn" onClick={onClose}>✖</button>
    </div>

    {/* Avatar and action buttons row */}
    <div className="avatar-row">
      <div className="avatar-preview">
        {avatarFile ? (
          <img src={URL.createObjectURL(avatarFile)} alt="Avatar Preview" />
        ) : user.avatar ? (
          <img src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar}`} alt={user.name} />
        ) : (
          <div className="avatar-placeholder">{user.name?.charAt(0)}</div>
        )}
        <label className="select-avatar-btn">
          + Select Avatar
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {/* Buttons on the right side */}
      <div className="avatar-buttons">
      
        <button type="submit" disabled={submitting} className="btn-save" onClick={handleSubmit}>
          {submitting ? "Saving..." : "Save"}
        </button>
          <button type="button" onClick={onClose} disabled={submitting} className="btn-cancel">
          Cancel
        </button>
      </div>
    </div>

    <form className="edit-form">
      <label>Name</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <label>Username</label>
      <input
        type="text"
        value={form.username}
        onChange={(e) => handleChange("username", e.target.value)}
      />

      <label>Email</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <label>About</label>
      <textarea
        value={form.about}
        onChange={(e) => handleChange("about", e.target.value)}
      />

      <label>Birthday</label>
      <input
        type="date"
        value={form.birthday}
        onChange={(e) => handleChange("birthday", e.target.value)}
      />

      <label>Height (cm)</label>
      <input
        type="number"
        value={form.height}
        onChange={(e) => handleChange("height", e.target.value)}
      />

      <label>Weight (kg)</label>
      <input
        type="number"
        value={form.weight}
        onChange={(e) => handleChange("weight", e.target.value)}
      />
    </form>
  </div>
</div>


  );
}
