import { create } from "zustand";

interface IUserInfo {
  id?: string;
  uuid?: string;
  name?: string;
  ticket?: number;
  selection: number[];
  ticketSelectList: number[];
  numberList: number[];
  isStartGame: boolean;
  isHostReady: boolean;
  playerBingo: number[];
}

interface IUserInfoStore extends IUserInfo {
  update: <T extends keyof IUserInfo>(key: T, value: IUserInfo[T]) => void;
  updateAll: (data: IUserInfo) => void;
}

export const useUserInfo = create<IUserInfoStore>((set) => ({
  id: undefined,
  uuid: undefined,
  name: undefined,
  ticket: undefined,
  isStartGame: false,
  isHostReady: false,
  selection: [],
  ticketSelectList: [],
  numberList: [],
  playerBingo: [],
  update: (key, value) => {
    set((state) => ({ ...state, [key]: value }));
  },
  updateAll: (data) => {
    set({ ...data });
  },
}));
