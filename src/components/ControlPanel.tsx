// import { useEffect } from "react";
import { useEffect, useState } from "react";
import { SPEECH, TICKETS } from "../constance";
import { socket } from "../services/socket";
import { useUserInfo } from "../stores/userStore";

const ControlPanel = () => {
  const { id, name, ticket, selection, numberList } = useUserInfo();
  const [bingoDisabled, setBingoDisabled] = useState(false);

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
    if (bingoDisabled) return;

    const bingoArr = getBingoList();
    if (!bingoArr) return;

    setBingoDisabled(true);
    setTimeout(() => setBingoDisabled(false), 3000);
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
          style={{
            opacity: getBingoList() && !bingoDisabled ? "1" : ".5",
            width: "100%",
          }}
          className={`btn-bingo ${
            getBingoList() && !bingoDisabled ? "btn-bingo-animation" : ""
          }`}
          onClick={handleBingo}
          disabled={!getBingoList() || bingoDisabled}
        >
          Kinh
        </button>
      </div>
      <div className="container history-number-container">
        {numberList.map((x) => (
          <div className="history-number">{x}</div>
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
