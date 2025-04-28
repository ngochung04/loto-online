import React from "react";
import { useUserInfo } from "../stores/userStore";
import { socket } from "../services/socket";
import { v4 as uuidv4 } from "uuid";

const LoginPage = () => {
  const { update } = useUserInfo();
  const [username, setUsername] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim()) {
      const id = uuidv4();
      update("name", username.trim());
      update("uuid", id);
      localStorage.setItem("name", username.trim());
      localStorage.setItem("uuid", id);
      socket.emit("client:update_info", {
        name: username.trim(),
        uuid: id,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            background: "linear-gradient(90deg, #ff512f 0%, #dd2476 100%)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 18,
            padding: "4px 16px",
            borderRadius: 20,
            letterSpacing: 2,
            boxShadow: "0 2px 8px rgba(221,36,118,0.15)",
            textTransform: "uppercase",
          }}
        >
          BETA
        </span>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          minWidth: 320,
          maxWidth: "90vw",
        }}
      >
        <h2 style={{ textAlign: "center", margin: 0, color: "#2563eb" }}>
          Login
        </h2>
        <label htmlFor="username" style={{ fontWeight: 500, color: "#334155" }}>
          User Name
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên của bạn"
          required
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #cbd5e1",
            fontSize: 16,
            outline: "none",
            transition: "border 0.2s",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 0",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            marginTop: 8,
            transition: "background 0.2s",
          }}
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
