// import { useEffect } from "react";
import { useEffect } from "react";
import { SPEECH, TICKETS } from "../constance";
import { socket } from "../services/socket";
import { useUserInfo } from "../stores/userStore";

const ControlPanel = () => {
  const { id, name, ticket, selection, numberList } = useUserInfo();

  useEffect(() => {
    const speak = (id: number) => {
      const audio = new Audio(SPEECH[id as keyof typeof SPEECH]);
      audio.play();
    };

    if (numberList.length) {
      speak(Number(numberList[0]));
    }
  }, [numberList]);

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
      fullSelection: selection,
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
          maxHeight: "calc(100% - 216px)",
          overflow: "auto",
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
          display: "inline block",
          gap: "8px",
          maxHeight: "calc(100% - 216px)",
          overflow: "auto",
          minHeight: "calc(100vh - 234px)",
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
