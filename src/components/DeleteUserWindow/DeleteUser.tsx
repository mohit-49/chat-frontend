"use client";
import React, { useState } from "react";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import "./DeleteUser.css";

export default function DeleteUser({ onClose, user }: { onClose: () => void; user: any }) {
  const [loading, setLoading] = useState(false);
  const token = getToken();
  const router = useRouter();

const handleDelete = () => {
  toast.custom((t) => (
    <div className="toast-container">
      <h4>⚠️ Confirm Deletion</h4>
      <p>
        Are you sure you want to delete your account? This is a <b>soft delete</b>.
      </p>
      <div className="toast-buttons">
        <button className="toast-cancel" onClick={() => toast.dismiss(t.id)}>
          Cancel
        </button>
        <button
          className="toast-delete"
          onClick={async () => {
            toast.dismiss(t.id);
            setLoading(true);
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile/delete`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
              });
              const json = await res.json();
              if (!res.ok) throw new Error(json.message || "Delete failed");
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              toast.success("Account deleted successfully", { className: "toast-success" });
              router.push("/login");
            } catch (err) {
              console.error(err);
              toast.error("Delete failed", { className: "toast-error" });
            } finally {
              setLoading(false);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ));
};


  return (
    <>
      <Toaster position="top-center" />
    <div className="modal-backdrop">
  <div className="delete-modal">
    <h3>Delete Account</h3>
    <p>
      Soft delete will keep your data in the database but hide your account from other users.
    </p>
    <div className="modal-actions">
      <button className="btn-cancel" onClick={onClose} disabled={loading}>
        Cancel
      </button>
      <button className="btn-delete" onClick={handleDelete} disabled={loading}>
        Delete
      </button>
    </div>
  </div>
</div>

    </>
  );
}
