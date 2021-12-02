import React from "react";
import { defaultIMusic, IMusicContext } from "@interface/database";

const defaultMusicContex :IMusicContext = {
    music: defaultIMusic
}

const musicContext = React.createContext<IMusicContext>(defaultMusicContex)

export default musicContext
export { defaultMusicContex }