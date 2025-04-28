import React from "react";

const spinnerContainer: React.CSSProperties = {
  position: "relative",
  width: "90px",
  height: "90px",
  margin: "0 auto",
};

const rainbowGlowStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  zIndex: 1,
  filter: "blur(12px)",
  background:
    "conic-gradient(from 0deg, #ff0000, #ff9900, #ffff00, #33ff00, #00ffff, #0066ff, #cc00ff, #ff0000)",
  animation: "rainbow-spin 2s linear infinite",
  opacity: 0.8,
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
};

const textStyle: React.CSSProperties = {
  marginTop: "24px",
  fontSize: "1.3rem",
  color: "#333",
  fontWeight: 500,
  textAlign: "center",
};

const WaitingHost: React.FC = () => (
  <div style={containerStyle}>
    <div style={spinnerContainer}>
      <div style={rainbowGlowStyle} />
    </div>
    <div style={textStyle}>
      Đang chờ chủ phòng tham gia...
      <br />
      Vui lòng đợi trong giây lát.
    </div>
    <style>
      {`
        @keyframes rainbow-spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
    </style>
  </div>
);

export default WaitingHost;
