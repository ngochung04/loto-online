import "./App.css";
import History from "./components/History";
import { Host } from "./components/Host";
import ControlPanel from "./components/ControlPanel";
import Ticket from "./components/Ticket";
import LoginPage from "./pages/Login";
import TicketListPage from "./pages/TicketList";
import { useUserInfo } from "./stores/userStore";
import { useEffect } from "react";
import { socket } from "./services/socket";
import { TICKETS } from "./constance";
import WaitingHost from "./components/WaitingHost";
import Bingo from "./components/Bingo";

function App() {
  const { ticket, name, isStartGame, playerBingo, isHostReady, update } =
    useUserInfo();

  useEffect(() => {
    socket.on("client:listener", (_) => {
      Object.entries(_).forEach(([key, value]) => {
        update(key as any, value);
      });
    });

    return () => {
      socket.off("client:listener");
      socket.disconnect();
    };
  }, [update]);

  useEffect(() => {
    const savedName = localStorage.getItem("name");
    const savedUuid = localStorage.getItem("uuid");
    if (savedName) {
      update("name", savedName);

      update("uuid", savedUuid ?? "");

      socket.emit("client:update_info", {
        name: savedName,
        savedUuid,
      });
    }
  }, [isHostReady, update]);

  if (name === "host") return <Host />;
  if (!name) return <LoginPage />;
  if (playerBingo.length) return <Bingo />;
  if (!isHostReady || (!ticket && isStartGame && isHostReady))
    return (
      <WaitingHost waitNextRound={!ticket && isStartGame && isHostReady} />
    );
  if (!isStartGame) return <TicketListPage />;

  return (
    <div
      className="loto-container"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
        padding: 0,
      }}
    >
      <div
        className="tickets-list"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 32px",
          gap: "16px",
          position: "relative",
          height: "calc(100vh - 32px)",
        }}
      >
        <img
          src="/background.jpeg"
          style={{
            position: "absolute",
            zIndex: 1,
            top: "0",
            left: "50%",
            width: "100%",
            height: "100%",
            transform: "translateX(-50%)",
          }}
        />
        <History />
        <Ticket ticketId={ticket as keyof typeof TICKETS} />
        {/* <Ticket ticketId={1} /> */}
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
