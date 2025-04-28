import clsx from "clsx";
import { AvatarGenerator } from "random-avatar-generator";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface UserProps {
  id: string;
  name: string;
  tickerNumber: number;
  isRequestBingo: boolean;
  numberToCheck: number[];
  checkResult: number[];
  onCheckBingo: () => number[] | undefined;
  onAcceptBingo: () => void;
  onRejectBingo: () => void;
}

export const User = ({
  name,
  tickerNumber,
  isRequestBingo,
  numberToCheck,
  checkResult,
  onCheckBingo,
  onAcceptBingo,
  onRejectBingo,
}: UserProps) => {
  const generator = new AvatarGenerator();
  const avatar = generator.generateRandomAvatar();

  const getTicketImage = (number: number) => {
    return `/${number}.jpg`;
  };

  const handleCheckBingo = () => {
    onCheckBingo();
  };

  const isCheckBingo = () => checkResult.length > 0;

  const successCheckBingo = () => {
    if (
      checkResult.length === 5 &&
      checkResult.every((number) => number !== -1)
    ) {
      return true;
    }
    if (numberToCheck.every((number) => checkResult.includes(number))) {
      return true;
    }
    return false;
  };

  return (
    <div className={clsx("user-item", { "user-item--bingo": isRequestBingo })}>
      <div className="user-item-avatar">
        <img src={avatar} alt={name} />
      </div>
      <div className="user-item-info">
        <div className="user-item-name">
          {name} {isRequestBingo && <span className="bingo-label">Bingo</span>}
        </div>
        {isRequestBingo && (
          <>
            <div className="bingo-numbers">
              {numberToCheck.map((number) => (
                <span
                  key={number + name}
                  className={clsx("number-item number-item--small", {
                    "number-item--valid":
                      isCheckBingo() && checkResult.includes(number),
                    "number-item--invalid":
                      isCheckBingo() && !checkResult.includes(number),
                  })}
                >
                  {number}
                </span>
              ))}
            </div>
            <div className="bingo-action">
              <button
                className="bingo-action-button bingo-action-button--check"
                onClick={handleCheckBingo}
                disabled={isCheckBingo()}
              >
                Kiểm tra
              </button>
              {isCheckBingo() && (
                <>
                  <button
                    className="bingo-action-button bingo-action-button--accept"
                    onClick={onAcceptBingo}
                    disabled={!successCheckBingo()}
                  >
                    Chấp nhận
                  </button>
                  <button
                    className="bingo-action-button bingo-action-button--reject"
                    onClick={onRejectBingo}
                    disabled={successCheckBingo()}
                  >
                    Từ chối
                  </button>
                </>
              )}
            </div>
          </>
        )}
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
