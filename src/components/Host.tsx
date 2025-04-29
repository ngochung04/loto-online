/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { User } from "./User";
import { socket } from "../services/socket";

interface User {
  id: string;
  name: string;
  tickerNumber?: number;
  isRequestBingo: boolean;
  numberToCheck: number[];
  checkResult: number[];
  onCheckBingo: () => void;
  onAcceptBingo: () => void;
  onRejectBingo: () => void;
}

export const Host = () => {
  const [config, setConfig] = useState({
    isCanStart: false,
    isCanCallNewNumber: false,
  });
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
  const [startGame, setStartGame] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [isPauseGame, setIsPauseGame] = useState<boolean>(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const [autoID, setAutoID] = useState<any>(null);
  const [autoTime, setAutoTime] = useState<number>(0);

  const handleNewNumber = useCallback(() => {
    const available = numbers.filter((n) => !n.isChoose);
    if (!available.length) return;

    const selected =
      available[Math.floor(Math.random() * available.length)].number;

    setNumbers((prev) =>
      prev.map((n) =>
        n.number === selected
          ? { ...n, isChoose: true, key: `number-${selected}` }
          : n
      )
    );

    socket.emit("host:new_number", selected);

    setNewNumber(selected);
    setHistoryNumbers((prev) => [selected, ...prev]);
  }, [numbers]);

  const handleAuto = (type?: "disable" | "enable" | any) => {
    if (autoID || type === "disable") {
      clearInterval(autoID);
      setAutoID(null);
      setAutoTime(0);
    } else {
      handleNewNumber();
      const timerId = setInterval(() => {
        handleNewNumber();
      }, autoTime || 5000);
      setAutoID(timerId);
    }
  };

  useEffect(() => {
    return () => clearInterval(autoID);
  }, [autoID]);

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

  const handleStartGame = () => {
    // setStartGame(true);
    socket.emit("host:new_game");
    handleAuto("disable");
    setHistoryNumbers([]);
    setNewNumber(0);
    setNumbers(
      Array.from({ length: 90 }, (_, index) => ({
        number: index + 1,
        isChoose: false,
        key: `number-${index + 1}`,
      }))
    );
    setUsers((prev) => prev.map((x) => ({ ...x, tickerNumber: undefined })));
  };

  const handleEndGame = () => {
    setStartGame(false);
  };

  const handlePauseGame = () => {
    setIsPauseGame(!isPauseGame);
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

    const playerBingo: number[] = [];
    users.forEach((x) => {
      if (x.isRequestBingo) {
        playerBingo.push(x?.tickerNumber as number);
      }
    });

    socket.emit("client:player_bingo", playerBingo);
  };

  const rejectAllBingoFromClient = () => {
    setUsers(
      users.map((user) => {
        if (user.isRequestBingo)
          socket.emit("host:deny_bingo", {
            name: user.name,
            ticketId: user.tickerNumber,
          });
        return user.isRequestBingo ? { ...user, isRequestBingo: false } : user;
      })
    );
  };

  const acceptBingoFromClient = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isRequestBingo: false } : user
      )
    );
    const playerBingo = users.find((x) => x.id === id);
    socket.emit("client:player_bingo", [playerBingo?.tickerNumber]);
  };

  const rejectBingoFromClient = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isRequestBingo: false } : user
      )
    );

    const userName = users.find((x) => x.id === id)?.name;
    if (userName)
      socket.emit("host:deny_bingo", {
        name: userName,
      });
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

  const renderUsers = users.filter((user) => user.name !== "host");
  useEffect(() => {
    socket.on("host:listener", (_) => {
      setConfig(_);
    });
    socket.on("host:user", (_) => {
      setUsers((prev) => {
        const index = prev.findIndex((x) => x.id === _.id);
        if (index !== -1) {
          const newArr = prev;
          newArr[index] = _;
          return newArr;
        }
        return [...prev, _];
      });
    });
    socket.on("host:user_logout", (_) => {
      setUsers((prev) => prev.filter((x) => _.id !== x.id));
    });
    socket.on("bingo", (_) => {
      setUsers((prev) => {
        const newArr = prev.map((x) => {
          if (x.id === _.id) {
            return { ...x, ..._ };
          }
          return x;
        });
        console.log(prev, newArr);
        return newArr;
      });
    });

    socket.on("host:get_users", (_) => {
      setUsers(_);
    });

    return () => {
      socket.off("host:listener");
      socket.off("bingo");
      socket.off("host:user");
      socket.off("host:get_users");
    };
  }, []);

  useEffect(() => {
    if (startGame) {
      const interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      setTimerId(interval);
      return () => clearInterval(interval);
    }
  }, [startGame]);

  useEffect(() => {
    if (!startGame) return;

    if (isPauseGame) {
      clearInterval(timerId as NodeJS.Timeout);
      return;
    }

    if (!isPauseGame) {
      const interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
      setTimerId(interval);
      return () => clearInterval(timerId as NodeJS.Timeout);
    }
  }, [isPauseGame]);

  return (
    <div className="host-container">
      <div className="left-container">
        <div className="host-actions">
          <div className="buttons-container">
            <input
              type="number"
              defaultValue={5}
              min={3}
              max={60}
              step={0.5}
              style={{
                width: "60px",
                height: "32px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "0 8px",
                outline: "none",
                fontSize: "16px",
              }}
              onChange={(event) => {
                setAutoTime(
                  Number((event.target as HTMLInputElement).value) * 1000
                );
              }}
            />
            seconds
            <button
              style={{ opacity: !config.isCanCallNewNumber ? 0.5 : 1 }}
              disabled={!config.isCanCallNewNumber}
              onClick={handleAuto}
              className="button-new-number"
            >
              {autoID ? "Disable" : "Enable"} Auto
            </button>
            <button
              style={{ opacity: !config.isCanCallNewNumber ? 0.5 : 1 }}
              disabled={!config.isCanCallNewNumber}
              onClick={handleNewNumber}
              className="button-new-number"
            >
              Số mới
            </button>
            <button
              disabled={!config.isCanStart}
              onClick={() => {
                socket.emit("host:start_game");
              }}
              className="button-new-number"
              style={{ opacity: !config.isCanStart ? 0.5 : 1 }}
            >
              Start
            </button>
            <button
              disabled={config.isCanStart}
              onClick={handleStartGame}
              className="button-new-number"
              style={{ opacity: config.isCanStart ? 0.5 : 1 }}
            >
              New Game
            </button>
          </div>

          {startGame && (
            <div className="buttons">
              <div className="numbers-count">
                {`Đã kêu ${numbers.filter((n) => n.isChoose).length} / ${
                  numbers.length
                } số`}
              </div>
              <button
                onClick={handleNewNumber}
                className="button-new-number"
                disabled={countBingoUsers() > 0}
              >
                Số mới
                {countBingoUsers() > 0 && (
                  <div className="tool-tip">
                    <div className="tool-tip-icon"> ⓘ</div>
                    <div className="tool-tip-content">
                      {`Đang có ${countBingoUsers()} người chơi đang kinh`}
                    </div>
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="numbers">
          <div className="history-numbers">
            <h3>Lịch sử</h3>
            <div className="history-numbers-list">
              {historyNumbers.map((number) => (
                <div key={number} className="history-number-host">
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
              <h3>Users ( {renderUsers.length} )</h3>
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
              {renderUsers.map((user) => (
                <User
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  tickerNumber={user?.tickerNumber}
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
  );
};
