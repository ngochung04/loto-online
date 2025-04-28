// import { useEffect, useState } from "react";
// import { TICKET_COLORS } from "../constance";
// import { socket } from "../services/socket";
// import { useUserInfo } from "../stores/userStore";

// interface IMessage {
//   name: string;
//   ticketId: number;
//   message: string;
// }

const History = () => {
  // const [message, setMessage] = useState<IMessage[]>([]);
  // const { setId } = useUserInfo();

  // useEffect(() => {
  //   socket.on("client:setup", (_) => {
  //     setId(_.socketId);
  //   });

  //   return () => {
  //     socket.off("request_login");
  //   };
  // }, []);
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
      {/* {!!message.length &&
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
        ))} */}
    </div>
  );
};

export default History;
