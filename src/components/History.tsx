import { useEffect, useState } from "react";
import { TICKET_COLORS } from "../constance";
import { socket } from "../services/socket";

interface IMessage {
  name: string;
  ticketId: number;
  message: string;
}

const History = () => {
  const [message, setMessage] = useState<IMessage[]>([]);

  useEffect(() => {
    const addMessage = (data: IMessage) => {
      setMessage((prev) => [...prev, data]);
    };
    socket.on("request_login", addMessage);
    socket.on("request_logout", addMessage);
    socket.on("request_bingo", addMessage);
    socket.on("request_ticket", addMessage);

    return () => {
      socket.off("request_login");
      socket.off("request_logout");
      socket.off("request_bingo");
      socket.off("request_ticket");
    };
  }, []);
  return (
    <div
      className="container"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {!!message.length &&
        message?.map((_, i) => (
          <div
            key={i}
            style={{
              wordBreak: "break-word",
              background: "white",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                marginRight: "4px",
                color: TICKET_COLORS[_.ticketId as keyof typeof TICKET_COLORS],
              }}
            >
              {_.name}:
            </span>
            <span>{_.message}</span>
          </div>
        ))}
    </div>
  );
};

export default History;
