import React from "react";
import { defaultMusic } from "@interface/database";
import { IMusicContext } from "@interface/context";

const defaultMusicContex :IMusicContext = {
    music: defaultMusic
}

const musicContext = React.createContext<IMusicContext>(defaultMusicContex)

export default musicContext
export { defaultMusicContex }