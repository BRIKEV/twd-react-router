import { createContext } from "react-router";

export interface User {
  id: string;
  name: string;
  email: string;
}

export const userContext = createContext<User | null>(null);
