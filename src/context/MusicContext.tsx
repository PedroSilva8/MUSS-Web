import React from "react";
import { defaultIMusic } from "@interface/database";
import { IMusicContext } from "@interface/context";

const defaultMusicContex :IMusicContext = {
    music: defaultIMusic
}

const musicContext = React.createContext<IMusicContext>(defaultMusicContex)

export default musicContext
export { defaultMusicContex }