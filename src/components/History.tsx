import { TICKET_COLORS } from "../constance";

const History = () => {
  const list = [
    {
      name: "hungdn",
      ticketID: 1,
      message: "abc abc",
    },
    {
      name: "hungdn",
      ticketID: 1,
      message:
        "abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc abc ",
    },
    {
      name: "hungdn",
      ticketID: 3,
      message:
        "abcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabcabc",
    },
  ];
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
      {list.map((_, i) => (
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
              color: TICKET_COLORS[_.ticketID as keyof typeof TICKET_COLORS],
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
