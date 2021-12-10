import React, { useState } from "react";

import './switch.scss'

export interface ISwitchProps {
    label?: string
    checked: boolean
    onCheck: (checked: boolean) => void
}

const Switch = (props: ISwitchProps) => {

    return (
        <div className="element-switch">
            { props.label ? <span>{ props.label }</span> : <></> }
            <div onClick={() => props.onCheck(!props.checked)} className={ "element-switch-body" + (props.checked ? " checked" : "") }>
                <div className="element-switch-thumb"></div>
            </div>
        </div>
    );
}

Switch.defaultProps = {

};

export default Switch