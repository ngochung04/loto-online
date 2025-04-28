import { create } from "zustand";

interface IUserInfo {
  id?: string;
  name?: string;
  ticket?: number;
  selection: number[];
  ticketSelectList: number[];
  numberList: number[];
  isStartGame: boolean;
}

interface IUserInfoStore extends IUserInfo {
  update: <T extends keyof IUserInfo>(key: T, value: IUserInfo[T]) => void;
  updateAll: (data: IUserInfo) => void;
}

export const useUserInfo = create<IUserInfoStore>((set) => ({
  id: undefined,
  name: undefined,
  ticket: undefined,
  isStartGame: false,
  selection: [],
  ticketSelectList: [],
  numberList: [],
  update: (key, value) => {
    set((state) => ({ ...state, [key]: value }));
  },
  updateAll: (data) => {
    set({ ...data });
  },
}));
