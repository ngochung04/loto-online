import clsx from "clsx";
import { useEffect, useState } from "react";
import { User } from "./User";
import Header from "./Header";

interface User {
  id: string;
  name: string;
  tickerNumber: number;
  isRequestBingo: boolean;
  numberToCheck: number[];
  checkResult: number[];
  onCheckBingo: () => void;
  onAcceptBingo: () => void;
  onRejectBingo: () => void;
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
  const [newNumber, setNewNumber] = useState<number>(0);
  const [historyNumbers, setHistoryNumbers] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isSuccessAcceptAllBingo, setIsSuccessAcceptAllBingo] =
    useState<boolean>(false);

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

  const checkBingoFromClient = (id: string) => {
    const user = users.find((user) => user.id === id);
    const numbers = user?.numberToCheck;
    if (!user || !numbers) return;

    let bingoNumbers = numbers.filter((number) => isChoose(number));
    if (bingoNumbers.length === 0) {
      bingoNumbers = [-1, -1, -1, -1, -1];
    }
    setUsers((users) =>
      users.map((user) =>
        user.id === id ? { ...user, checkResult: bingoNumbers } : user
      )
    );
    console.log("bingoNumbers", bingoNumbers);
    return bingoNumbers;
  };

  const checkAllBingoFromClient = () => {
    const bingoUsers = users.filter((user) => user.isRequestBingo);
    console.log("bingoUsers", bingoUsers);

    let isAllBingo = false;
    bingoUsers.forEach((user) => {
      const bingo = checkBingoFromClient(user.id);
      if (bingo?.length === 5 && bingo.every((number) => number !== -1)) {
        isAllBingo = true;
      }
    });
    setIsSuccessAcceptAllBingo(isAllBingo);

    return isAllBingo;
  };

  const acceptAllBingoFromClient = () => {
    setUsers(
      users.map((user) =>
        user.isRequestBingo ? { ...user, isRequestBingo: false } : user
      )
    );
  };

  const rejectAllBingoFromClient = () => {
    setUsers(
      users.map((user) =>
        user.isRequestBingo ? { ...user, isRequestBingo: false } : user
      )
    );
  };

  const acceptBingoFromClient = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isRequestBingo: false } : user
      )
    );
  };

  const rejectBingoFromClient = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isRequestBingo: false } : user
      )
    );
  };

  const isChoose = (number: number) => {
    return numbers.some((item) => item.number === number && item.isChoose);
  };

  const countBingoUsers = () => {
    return users.filter((user) => user.isRequestBingo).length;
  };

  const countCheckBingoUsers = () => {
    return (
      users.filter((user) => user.checkResult.length > 0).length ===
      users.filter((user) => user.isRequestBingo).length
    );
  };

  useEffect(() => {
    setUsers([
      {
        id: "1",
        name: "Yan Pham",
        tickerNumber: 1,
        isRequestBingo: false,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
      {
        id: "2",
        name: "Ngan NTT",
        tickerNumber: 5,
        isRequestBingo: true,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
      {
        id: "3",
        name: "Ngoc Hung",
        tickerNumber: 3,
        isRequestBingo: false,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
      {
        id: "4",
        name: "Chi Chu",
        tickerNumber: 15,
        isRequestBingo: true,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
      {
        id: "5",
        name: "Huyen Nguyen",
        tickerNumber: 6,
        isRequestBingo: false,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
      {
        id: "6",
        name: "Phuong Linh",
        tickerNumber: 7,
        isRequestBingo: false,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
      {
        id: "7",
        name: "Nam Nho",
        tickerNumber: 10,
        isRequestBingo: false,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
      {
        id: "8",
        name: "Anh Duy",
        tickerNumber: 11,
        isRequestBingo: false,
        numberToCheck: [13, 84, 6, 15, 43],
        checkResult: [],
        onCheckBingo: () => {},
        onAcceptBingo: () => {},
        onRejectBingo: () => {},
      },
    ]);
  }, []);

  return (
    <>
      <Header />
      <div className="host-container">
        <div className="left-container">
          <div className="host-actions">
            <div className="buttons">
              <div className="numbers-count">
                {`Đã kêu ${numbers.filter((n) => n.isChoose).length} / ${
                  numbers.length
                } số`}
              </div>
              <button onClick={handleNewNumber} className="button-new-number">
                Số mới
              </button>
            </div>
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
              <div className="users-header">
                <h3>Users ( {users.length} )</h3>
                {countBingoUsers() > 1 && (
                  <button
                    className="bingo-action-button bingo-action-button--check"
                    onClick={checkAllBingoFromClient}
                    disabled={countCheckBingoUsers()}
                  >
                    Kiểm tra đồng loạt
                  </button>
                )}
                {countBingoUsers() > 1 && countCheckBingoUsers() && (
                  <button
                    className="bingo-action-button bingo-action-button--accept"
                    disabled={!isSuccessAcceptAllBingo}
                    onClick={acceptAllBingoFromClient}
                  >
                    Chấp nhận đồng loạt
                  </button>
                )}
                {countBingoUsers() > 1 && countCheckBingoUsers() && (
                  <button
                    className="bingo-action-button bingo-action-button--reject"
                    disabled={isSuccessAcceptAllBingo}
                    onClick={rejectAllBingoFromClient}
                  >
                    Từ chối đồng loạt
                  </button>
                )}
              </div>
              <div className="users-list">
                {users.map((user) => (
                  <User
                    key={user.id}
                    name={user.name}
                    tickerNumber={user.tickerNumber}
                    isRequestBingo={user.isRequestBingo}
                    numberToCheck={user.numberToCheck}
                    checkResult={user.checkResult}
                    onCheckBingo={() => checkBingoFromClient(user.id)}
                    onAcceptBingo={() => acceptBingoFromClient(user.id)}
                    onRejectBingo={() => rejectBingoFromClient(user.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="right-container"></div>
      </div>
    </>
  );
};
