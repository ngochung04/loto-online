import clsx from "clsx";
import { useEffect, useState } from "react";
import { User } from "./User";

interface User {
  id: string;
  name: string;
  tickerNumber: number;
  isRequestBingo: boolean;
}

export const Host = () => {
  const [numbers, setNumbers] = useState<
    { number: number; isChoose: boolean; key: string }[]
  >(
    Array.from({ length: 90 }, (_, index) => ({
      number: index + 1,
      isChoose: false,
      key: `number-${index + 1}`,
    }))
  );
  const [bingo, setBingo] = useState<boolean>(false);
  const [isShowResultMessage, setIsShowResultMessage] =
    useState<boolean>(false);
  const [numberToCheck, setNumberToCheck] = useState<number[]>([]);
  const [newNumber, setNewNumber] = useState<number>(0);
  const [historyNumbers, setHistoryNumbers] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const handleNewNumber = () => {
    const available = numbers.filter((n) => !n.isChoose);
    if (!available.length) return;

    const selected =
      available[Math.floor(Math.random() * available.length)].number;

    setNumbers(
      numbers.map((n) =>
        n.number === selected
          ? { ...n, isChoose: true, key: `number-${selected}` }
          : n
      )
    );
    setNewNumber(selected);
    setHistoryNumbers([...historyNumbers, selected]);
  };

  const checkBingoFromClient = (numbers: number[]) => {
    setNumberToCheck(numbers);
    const bingo = numbers.filter((number) => isChoose(number));
    if (bingo.length === 5) {
      setBingo(true);
    }
    setIsShowResultMessage(true);
  };

  const isChoose = (number: number) => {
    return numbers.some((item) => item.number === number && item.isChoose);
  };

  useEffect(() => {
    setUsers([
      { id: "1", name: "Yan Pham", tickerNumber: 1, isRequestBingo: false },
      { id: "2", name: "Ngan NTT", tickerNumber: 5, isRequestBingo: true },
      { id: "3", name: "Ngoc Hung", tickerNumber: 3, isRequestBingo: false },
      { id: "4", name: "Chi Chu", tickerNumber: 15, isRequestBingo: false },
      { id: "5", name: "Huyen Nguyen", tickerNumber: 6, isRequestBingo: false },
      { id: "6", name: "Phuong Linh", tickerNumber: 7, isRequestBingo: false },
      { id: "7", name: "Nam Nho", tickerNumber: 10, isRequestBingo: false },
      { id: "8", name: "Anh Duy", tickerNumber: 11, isRequestBingo: false },
    ]);
  }, []);

  return (
    <div className="host-container">
      <div className="left-container">
        <h2>Host</h2>
        <div className="host-actions">
          <div className="buttons">
            <button onClick={handleNewNumber}>Số mới</button>
            <button onClick={() => checkBingoFromClient([13, 84, 6, 15, 43])}>
              Kiểm tra
            </button>
          </div>
          {/* snack message */}
          {isShowResultMessage && (
            <div className="host-result-message">
              <div className="number-to-check">
                {numberToCheck.map((number) => (
                  <div
                    key={number}
                    className={clsx(
                      "number-item",
                      isChoose(number)
                        ? "number-item--valid"
                        : "number-item--invalid"
                    )}
                  >
                    {number}
                  </div>
                ))}
              </div>
              <div
                className={clsx(
                  "result-message",
                  bingo && "result-message--success"
                )}
              >
                {bingo ? "Hợp lệ" : "Chưa hợp lệ"}
              </div>
            </div>
          )}
        </div>
        <div className="numbers">
          <div className="history-numbers">
            <h3>Lịch sử</h3>
            <div className="history-numbers-list">
              {historyNumbers.map((number) => (
                <div key={number} className="history-number">
                  {number}
                </div>
              ))}
            </div>
          </div>
          <div className="number-container">
            {numbers.map((number, index) => (
              <div
                key={number.key}
                className={clsx(
                  "number-item",
                  number.isChoose && "number-item--ischoose",
                  newNumber === index + 1 && "number-item--new-number"
                )}
              >
                <span>{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="users-container">
            <h3>Users ( {users.length} )</h3>
            <div className="users-list">
              {users.map((user) => (
                <User
                  key={user.id}
                  name={user.name}
                  tickerNumber={user.tickerNumber}
                  isRequestBingo={user.isRequestBingo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
};
