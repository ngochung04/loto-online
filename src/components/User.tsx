import { AvatarGenerator } from "random-avatar-generator";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface UserProps {
  name: string;
  tickerNumber: number;
  isRequestBingo: boolean;
}

export const User = ({ name, tickerNumber, isRequestBingo }: UserProps) => {
  const generator = new AvatarGenerator();
  const avatar = generator.generateRandomAvatar();
  const getTicketImage = (number: number) => {
    return `/${number}.jpg`;
  };
  return (
    <div className="user-item">
      <div className="user-item-avatar">
        <img src={avatar} alt={name} />
      </div>
      <div className="user-item-info">
        <div className="user-item-name">
          {name} {isRequestBingo && <span className="bingo-label">Bingo</span>}
        </div>
        <div className="bingo-number">
          {isRequestBingo && <span>Bingo</span>}
        </div>
      </div>
      <div className="user-item-ticker">
        <span>Ticker: {tickerNumber}</span>
        <div className="ticket-preview">
          <PhotoProvider>
            <PhotoView src={getTicketImage(tickerNumber)}>
              <img src={getTicketImage(tickerNumber)} alt={name} />
            </PhotoView>
          </PhotoProvider>
        </div>
      </div>
    </div>
  );
};
