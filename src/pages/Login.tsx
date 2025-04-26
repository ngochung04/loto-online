import React from "react";
import { useUserInfo } from "../stores/userStore";
import { socket } from "../services/socket";

const LoginPage = () => {
  const { setName } = useUserInfo();
  const [username, setUsername] = React.useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("asd");

    socket.emit("request_login", username.trim());
    if (username.trim()) {
      setName(username.trim());
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
