import { TICKETS, TICKET_COLORS } from "../constance";
import { useUserInfo } from "../stores/userStore";

const Ticket = ({
  ticketId,
  size = "default",
}: {
  ticketId: keyof typeof TICKETS;
  size?: "default" | "small" | "preview";
}) => {
  const { selection, update } = useUserInfo();
  const isPreview = size === "small" || size === "preview";

  const handleClick = (number: number) => {
    if (isPreview) return;
    if (selection.includes(number)) {
      update(
        "selection",
        selection.filter((_) => _ !== number)
      );
      return;
    }
    update("selection", [...selection, number]);
  };

  const renderRow = (data: number[]) => {
    return Array.from({ length: 9 }, (_, i) => {
      const value = data.find((_) => {
        if (i === 8 && _ === 90) return true;
        if (_ < i * 10 + 10 && _ >= i * 10) return true;
        return false;
      });

      if (value)
        return (
          <div
            key={i}
            className={`ticket_row__number ${
              selection.includes(value) ? "checked" : ""
            }`}
            onClick={() => handleClick(value)}
            style={{ cursor: "pointer" }}
          >
            {value}
          </div>
        );

      return (
        <div
          key={i}
          className="ticket_row__number"
          style={{
            backgroundColor: TICKET_COLORS[ticketId],
          }}
        ></div>
      );
    });
  };

  return (
    <div className={`ticket_container ${size}`}>
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
