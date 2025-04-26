import { socket } from "../services/socket";
import { useUserData, useUserInfo } from "../stores/userStore";

const ControlPanel = () => {
  const number = [1, 23, 3, 4, 5, 63, 1, 23, 3, 4, 5, 63];

  const { name, ticketId } = useUserInfo();
  const { selection } = useUserData();

  const handleBingo = () => {
    socket.emit("request_bingo", {
      name,
      ticketId,
      selection,
    });
  };

  return (
    <div style={{ width: "100%", zIndex: 10 }}>
      <div
        className="container"
        style={{
          marginBottom: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {number.reverse().map((x) => (
          <div className="history-number">{x}</div>
        ))}
      </div>
      <div
        className="container"
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button className="btn-bingo" onClick={handleBingo}>
          KINH
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
