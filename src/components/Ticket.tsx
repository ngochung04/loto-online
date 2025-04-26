import { useState } from "react";
import { TICKETS, TICKET_COLORS } from "../constance";

const Ticket = ({ ticketId }: { ticketId: keyof typeof TICKETS }) => {
  const [checkedList, setCheckedList] = useState<number[]>([]);

  const handleClick = (number: number) => {
    setCheckedList((prev) => {
      if (prev.includes(number)) return prev.filter((_) => _ !== number);

      return [...prev, number];
    });
  };

  console.log(checkedList);

  const renderRow = (data: number[]) => {
    return Array.from({ length: 9 }, (_, i) => {
      const value = data.find((_) => {
        if (_ < i * 10 + 10 && _ >= i * 10) return true;
        return false;
      });

      if (value)
        return (
          <div
            key={i}
            className={`ticket_row__number ${
              checkedList.includes(value) ? "checked" : ""
            }`}
            onClick={() => handleClick(value)}
          >
            {value}
          </div>
        );

      return (
        <div
          key={i}
          className="ticket_row__number"
          style={{ backgroundColor: TICKET_COLORS[ticketId] }}
        ></div>
      );
    });
  };

  return (
    <div className="ticket_container">
      <div className="ticket_block">
        <div className="ticket_row">{renderRow(TICKETS[ticketId][0])} </div>
        <div className="ticket_row">{renderRow(TICKETS[ticketId][1])} </div>
        <div className="ticket_row">{renderRow(TICKETS[ticketId][2])} </div>
      </div>
      <div className="ticket_block">
        <div className="ticket_row">{renderRow(TICKETS[ticketId][3])} </div>
        <div className="ticket_row">{renderRow(TICKETS[ticketId][4])} </div>
        <div className="ticket_row">{renderRow(TICKETS[ticketId][5])} </div>
      </div>
      <div className="ticket_block">
        <div className="ticket_row">{renderRow(TICKETS[ticketId][6])} </div>
        <div className="ticket_row">{renderRow(TICKETS[ticketId][7])} </div>
        <div className="ticket_row">{renderRow(TICKETS[ticketId][8])} </div>
      </div>
    </div>
  );
};

export default Ticket;
