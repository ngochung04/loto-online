import { socket } from "../services/socket";
import { useUserInfo } from "../stores/userStore";

const Header = () => {
  const { name, ticketId, setTicketId, logout } = useUserInfo();

  return (
    <header
      style={{
        width: "100%",
        background: "#2563eb",
        color: "#fff",
        padding: "8px 0 8px 0",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: 1,
        textAlign: "center",
        boxShadow: "0 2px 12px rgba(37,99,235,0.08)",
        marginBottom: 16,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}
    >
      {name}
      <span
        style={{
          fontSize: "12px",
          cursor: "pointer",
          color: "#fc2626",
          marginLeft: "8px",
          textDecoration: "underline",
        }}
        onClick={() => {
          socket.disconnect();
          logout();
        }}
      >
        [LOGOUT]
      </span>
      {ticketId && (
        <div
          style={{
            fontSize: "12px",
          }}
        >
          Ticket ID: {ticketId}{" "}
          <span
            style={{
              color: "white",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              setTicketId(null);
            }}
          >
            [CHANGE]
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
