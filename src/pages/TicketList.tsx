import { TICKETS } from "../constance";
import Ticket from "../components/Ticket";
import { useUserInfo } from "../stores/userStore";
import { useEffect } from "react";
import { socket } from "../services/socket";

const TicketListPage = () => {
  const { name, ticket, ticketSelectList, update, isStartGame } = useUserInfo();

  useEffect(() => {
    socket.emit("client:get_ticket");
  }, []);

  const handleSelectTicket = (id: number) => () => {
    update("ticket", id);
    socket.emit("client:update_info", { name, ticket: +id });
  };

  return (
    <>
      {/* {!isStartGame && <div className="ticket-list-page-background">asdasdasd</div>} */}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, max-content))",
            justifyContent: "center",
            gap: 24,
            width: "100%",
          }}
        >
          {Object.keys(TICKETS).map((id) => {
            const isSelected = ticketSelectList.includes(+id);
            return (
              <div
                key={id}
                style={{
                  boxSizing: "border-box",
                  border:
                    ticket === Number(id)
                      ? "5px solid red"
                      : "5px solid transparent",
                  cursor: isSelected ? "not-allowed" : "pointer",
                  transition: "transform 0.15s, border-color 0.15s",
                  opacity: isSelected && !(ticket === Number(id)) ? 0.3 : 1,
                }}
                onClick={isSelected ? () => {} : handleSelectTicket(Number(id))}
              >
                <Ticket
                  ticketId={Number(id) as keyof typeof TICKETS}
                  size="small"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TicketListPage;
