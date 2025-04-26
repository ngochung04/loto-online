import "./App.css";
import { useState } from "react";
import Ticket from "./components/Ticket";

function App() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="loto-container">
      <div className="tickets-list">
        <Ticket ticketId={5} />
      </div>
      {selected && (
        <div className="selected-info">Bạn đã chọn vé số {selected}</div>
      )}
    </div>
  );
}

export default App;
