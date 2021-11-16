export interface Theme {
    name: string

    font?: string
    font_disable?: string

    background?: string
    surface?: string

    boxShadow?: string
    
    primary?: string
    primary_alt?: string
    
    secondary?: string
    secondary_alt?: string

    highlight?: string
    highlight_alt?: string

    border?: string
    border_alt?: string
}

export default class Themehandler {
    static Themes: Theme[] = [];

    static hexToRgb = (hex: string) : string => {
        var arrBuff = new ArrayBuffer(4);
        var vw = new DataView(arrBuff);
        vw.setUint32(0,parseInt(hex.substring(1), 16),false);
        var arrByte = new Uint8Array(arrBuff);
      
        return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];
    }

    static SetTheme = (name: string) => {
        //Array.Find is faster than loop
        for (const [key, val] of Object.entries(this.Themes.find((val) => val.name == name))) {
            if (key != "name") {
                document.documentElement.style.setProperty('--' + key.replace('_', '-'), val);
                document.documentElement.style.setProperty('--rgb-' + key.replace('_', '-'), this.hexToRgb(val));
            }
        }
    }
}