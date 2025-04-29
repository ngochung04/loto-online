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
  // const { setId } = useUserInfo();

  useEffect(() => {
    socket.on("client:message", (_) => {
      setMessage((prev) => [
        ...prev,
        {
          name: _.name,
          ticketId: _.ticketNumber,
          message: _.message,
        },
      ]);
    });

    return () => {
      socket.off("client:message");
    };
  }, []);
  return (
    <div
      className="container hidden_mobile"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        height: "calc(100vh - 64px)",
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
