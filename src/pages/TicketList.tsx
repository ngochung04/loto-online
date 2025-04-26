import { TICKETS } from "../constance";
import Ticket from "../components/Ticket";
import Header from "../components/Header";
import { useUserData, useUserInfo } from "../stores/userStore";
import { useEffect } from "react";
import { socket } from "../services/socket";

const TicketListPage = () => {
  const { setTicketId } = useUserInfo();
  const { setSelection } = useUserData();

  useEffect(() => {
    setSelection([]);
  }, []);

  return (
    <>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
          padding: "0 32px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#2563eb", marginBottom: 24, marginTop: 0 }}>
          Choose your ticket
        </h2>
        <div
          style={{
            display: "grid",
            gridAutoFlow: "row",
            gridAutoColumns: "max-content",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, max-content))",
            justifyContent: "center",
            gap: 24,
            width: "100%",
          }}
        >
          {Object.keys(TICKETS).map((id) => (
            <div
              key={id}
              style={{ cursor: "pointer", transition: "transform 0.15s" }}
              onClick={() => {
                setTicketId(Number(id) as keyof typeof TICKETS);
                socket.emit("request_ticket", +id);
              }}
            >
              <Ticket
                ticketId={Number(id) as keyof typeof TICKETS}
                size="small"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TicketListPage;
