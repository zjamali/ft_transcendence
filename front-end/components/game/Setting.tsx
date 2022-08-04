import React, { useEffect, useState } from 'react'
import socket from '../../Library/Socket';
import style  from '../../styles/Setting.module.css'

const Setting = ({setSetting, data}: any) => {

    // socket.io.opts.query.data.set_Height(700)
    
    const [isMap, setMap] = useState('#000000')
    const [isPaddle, setPaddle] = useState('#FFFFFF')
    const [isBall, setBall] = useState('#FFFF00')
    const [isBorder, setBorder] = useState('#FFFFFF')
    const [isText, setText] = useState('#FFFFFF')
    const [isTrace, setTrace] = useState('#FFFFFF')

    const handleCancel = () => {
        setSetting(true)
    }
    const handleApply = (e: any) => {
        e.preventDefault();
        if (data)
        {
            
            data.set_mapColor(isMap);
            data.set_paddleColor(isPaddle);
            data.set_ballColor(isBall);
            data.set_borderColor(isBorder);
            data.set_textColor(isText);
            data.set_traceColor(isTrace);
            console.log(data.get_mapColor());
            
        }
        setSetting(true);
    }
    const handleMap = (e: any) => {
        setMap(e.target.value)
    }
    const handlePaddle = (e: any) => {
        setPaddle(e.target.value)
    }
    const handleBall = (e: any) => {
        setBall(e.target.value)
    }
    const handleBorder = (e: any) => {
        setBorder(e.target.value)
    }
    const handleText = (e: any) => {
        setText(e.target.value)
    }
    const handleTrace = (e: any) => {
        setTrace(e.target.value)
    }

  return (
        <div className={style.box}>
            <h1 className={style.title}>SETTING</h1>
            <form>
                <div className={style.field}>
                    <div>
                        <label>Map Color :</label>
                        <select onChange={handleMap}>
                            <option hidden value="">Choose Color The Map</option>
                            <option value="#000000">Black</option>
                            <option value="#800000">Maroon</option>
                            <option value="#800080">Purple</option>
                            <option value="#000080">Navy</option>
                        </select>
                    </div>
                    <div>
                        <label>Paddle Color :</label>
                        <select onChange={handlePaddle}>
                            <option hidden value="">Choose Color The Paddle</option>
                            <option value="#FFFFFF">White</option>
                            <option value="#FFFF00">Yellow</option>
                            <option value="#008000">Green</option>
                            <option value="#008080">Teal</option>
                        </select>
                    </div>
                </div>
                <div className={style.field}>
                    <div>
                        <label>Ball Color :</label>
                        <select onChange={handleBall}>
                            <option hidden value="">Choose Color The Ball</option>
                            <option value="#FFFF00">Yellow</option>
                            <option value="#FF00FF">Fuchsia</option>
                            <option value="#808080">Gray</option>
                            <option value="#C0C0C0">Silver</option>
                        </select>
                    </div>
                    <div>
                        <label>Border Color :</label>
                        <select onChange={handleBorder}>
                            <option hidden value="">Choose Color The Border</option>
                            <option value="#FFFFFF">White</option>
                            <option value="#800080">Purple</option>
                            <option value="#00FFFF">Aqua</option>
                            <option value="#00FF00">Lime</option>
                        </select>
                    </div>
                </div>
                <div className={style.field}>
                    <div>
                        <label>Text Color :</label>
                        <select onChange={handleText}>
                            <option hidden value="">Choose Color The Ball</option>
                            <option value="#FFFFFF">White</option>
                            <option value="#00FF00">Lime</option>
                            <option value="#FF00FF">Fuchsia</option>
                            <option value="#FFFF00">Yellow</option>
                        </select>
                    </div>
                    <div>
                        <label>Trace Color :</label>
                        <select onChange={handleTrace}>
                            <option hidden value="">Choose Color The Border</option>
                            <option value="#FFFFFF">White</option>
                            <option value="#00FF00">Lime</option>
                            <option value="#FF00FF">Fuchsia</option>
                            <option value="#FFFF00">Yellow</option>
                        </select>
                    </div>
                </div>
                <div className={style.btns}>
                    <button className={style.apply} onClick={handleApply}>APPLY</button>
                    <button className={style.cancel} onClick={handleCancel}>CANCEL</button>
                </div>
            </form>
        </div>
  )
}

export default Setting