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

function App() {
  const { ticket, name, isStartGame, playerBingo, isHostReady, update } =
    useUserInfo();

  useEffect(() => {
    socket.connect();

    socket.on("client:listener", (_) => {
      Object.entries(_).forEach(([key, value]) => {
        update(key as any, value);
      });
    });

    return () => {
      socket.off("client:listener");
      socket.disconnect();
    };
  }, []);

  if (name === "host") return <Host />;
  if (!name) return <LoginPage />;
  if (!isHostReady) return <>waiting host</>;
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
        }}
      >
        <img
          src="/background.jpeg"
          style={{
            position: "absolute",
            zIndex: 1,
            top: "0",
            left: "50%",
            width: "calc(100% - 32px)",
            height: "100%",
            transform: "translateX(-50%)",
          }}
        />
        <History />
        <Ticket ticketId={ticket as keyof typeof TICKETS} />
        {/* <Ticket ticketId={1} /> */}
        <ControlPanel />
        {playerBingo.map((x) => {
          return (
            <>
              {x}
              <Ticket ticketId={x as keyof typeof TICKETS} />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default App;
