import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TICKETS } from "../constance";

interface IUserInfo {
  name: string;
  setName: (_: string) => void;
  ticketId: keyof typeof TICKETS | null;
  setTicketId: (_: keyof typeof TICKETS | null) => void;
  logout: () => void;
}

export const useUserInfo = create<IUserInfo>()(
  persist(
    (set) => ({
      name: "",
      ticketId: null,
      setName: (_) => {
        set({ name: _ });
      },
      setTicketId: (_) => {
        set({ ticketId: _ });
      },
      logout: () => {
        set({ name: "", ticketId: null });
      },
    }),
    {
      name: "user-info", // name of the item in the storage (must be unique)
    }
  )
);

interface IUserData {
  selection: number[];
  setSelection: (_: number[]) => void;
  resetSelection: () => void;
}

export const useUserData = create<IUserData>((set) => ({
  selection: [],
  setSelection: (_) => {
    set({ selection: _ });
  },
  resetSelection: () => {
    set(() => ({ selection: [] }));
  },
}));
