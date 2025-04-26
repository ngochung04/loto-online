import "./App.css";
import Header from "./components/Header";
import Ticket from "./components/Ticket";
import LoginPage from "./pages/Login";
import TicketListPage from "./pages/TicketList";
import { useUserInfo } from "./stores/userStore";

function App() {
  const { name, ticketId } = useUserInfo();

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
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Ticket ticketId={ticketId} />
      </div>
    </div>
  );
}

export default App;
