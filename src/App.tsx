import "./App.css";
import Header from "./components/Header";
import History from "./components/History";
import { Host } from "./components/Host";
import ControlPanel from "./components/ControlPanel";
import Ticket from "./components/Ticket";
import LoginPage from "./pages/Login";
import TicketListPage from "./pages/TicketList";
import { useUserInfo } from "./stores/userStore";
import { useEffect } from "react";
import { socket } from "./services/socket";

function App() {
  const { name, ticketId } = useUserInfo();

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  if (name === "host") return <Host />;
  if (!name) return <LoginPage />;
  if (!ticketId) return <TicketListPage />;

  return (
    <div
      className="loto-container"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)",
        padding: 0,
      }}
    >
      <Header />
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
        <Ticket ticketId={ticketId} />
        {/* <Ticket ticketId={1} /> */}
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
