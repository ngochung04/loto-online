import { TICKETS } from "../constance";
import { socket } from "../services/socket";
import { useUserInfo } from "../stores/userStore";

const ControlPanel = () => {
  const { id, name, ticket, selection, numberList } = useUserInfo();

  const getBingoList = () => {
    const ticketSelected = TICKETS[ticket as keyof typeof TICKETS];
    return ticketSelected.find((x) => {
      if (
        x.filter((y) => {
          return selection.includes(y);
        }).length === 5
      )
        return true;

      return false;
    });
  };

  const handleBingo = () => {
    const bingoArr = getBingoList();
    if (!bingoArr) return;
    socket.emit("host:bingo", {
      id,
      name,
      ticketNumber: ticket,
      numberToCheck: bingoArr,
      isRequestBingo: true,
      checkResult: [],
    });
  };

  return (
    <div style={{ width: "100%", zIndex: 10, maxHeight: "100vh" }}>
      <div
        className="container"
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          style={{ opacity: getBingoList() ? "1" : ".5", width: "100%" }}
          className={`btn-bingo ${getBingoList() ? "btn-bingo-animation" : ""}`}
          onClick={handleBingo}
        >
          Kinh
        </button>
      </div>
      <div
        className="container"
        style={{
          marginBottom: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {numberList.map((x) => (
          <div className="history-number">{x}</div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
