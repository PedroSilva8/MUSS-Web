import React, { useContext } from "react";
import { defaultUser } from "@interface/database";
import { IUserContext } from "@interface/context";

const defaultUserContex : IUserContext = {
    user: defaultUser,
    setUser: () => { },
    token: { token: "", isLoaded: false },
    setToken: () => { } 
}

const userContext = React.createContext<IUserContext>(defaultUserContex)

export default userContext
export { defaultUserContex }