import { createContext } from "react";

export const UserContext = createContext({
    user: null,
    username: null,
    image: null,
    name: null,
});
