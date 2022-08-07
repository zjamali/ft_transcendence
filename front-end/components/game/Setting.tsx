import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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

    const [age, setAge] = useState('');

    const handleChangee = (event:any) => {
      setAge(event.target.value);
    };

  return (
        <div className="game-settings">
            <div className="settings-header"><h3>Settings</h3></div>
            <div className="settings-form-data">
                <div className="form-half">
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }} size="small">
                        <InputLabel id="demo-select-small">Map color</InputLabel>
                        <Select
                            sx={{'.MuiSelect-select': {color: '#919eab'}}}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={isMap}
                            label="Age"
                            onChange={handleMap}
                            color="primary"
                        >
                            <MenuItem value={"#000000"}>Black</MenuItem>
                            <MenuItem value={"#800000"}>Maroon</MenuItem>
                            <MenuItem value={"#800080"}>Purple</MenuItem>
                            <MenuItem value={"#000080"}>Navy</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120,}} size="small">
                        <InputLabel id="demo-select-small">Paddle color</InputLabel>
                        <Select
                            sx={{'.MuiSelect-select': {color: '#919eab'}}}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={isPaddle}
                            label="Age"
                            onChange={handlePaddle}
                            color="primary"
                        >
                            <MenuItem value={"#FFFFFF"}>White</MenuItem>
                            <MenuItem value={"#FFFF00"}>Yellow</MenuItem>
                            <MenuItem value={"#008000"}>Green</MenuItem>
                            <MenuItem value={"#008080"}>Teal</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120,}} size="small">
                        <InputLabel id="demo-select-small">Ball color</InputLabel>
                        <Select
                            sx={{'.MuiSelect-select': {color: '#919eab'}}}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={isBall}
                            label="Age"
                            onChange={handleBall}
                            color="primary"
                        >
                            <MenuItem value={"#FFFF00"}>Yellow</MenuItem>
                            <MenuItem value={"#FF00FF"}>Fuchsia</MenuItem>
                            <MenuItem value={"#808080"}>Grey</MenuItem>
                            <MenuItem value={"#C0C0C0"}>Silver</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="form-half">
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, }} size="small">
                        <InputLabel id="demo-select-small">Text color</InputLabel>
                        <Select
                            sx={{'.MuiSelect-select': {color: '#919eab'}}}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={isText}
                            label="Age"
                            onChange={handleText}
                            color="primary"
                        >
                            <MenuItem value={"#FFFFFF"}>White</MenuItem>
                            <MenuItem value={"#00FF00"}>Lime</MenuItem>
                            <MenuItem value={"#FF00FF"}>Fuchsia</MenuItem>
                            <MenuItem value={"#FFFF00"}>Yellow</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120,}} size="small">
                        <InputLabel id="demo-select-small">Border color</InputLabel>
                        <Select
                            sx={{'.MuiSelect-select': {color: '#919eab'}}}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={isBorder}
                            label="Age"
                            onChange={handleBorder}
                            color="primary"
                        >
                            <MenuItem value={"#FFFFFF"}>White</MenuItem>
                            <MenuItem value={"#800080"}>Purple</MenuItem>
                            <MenuItem value={"#00FFFF"}>Aqua</MenuItem>
                            <MenuItem value={"#00FF00"}>Lime</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120,}} size="small">
                        <InputLabel id="demo-select-small">Trace color</InputLabel>
                        <Select
                            sx={{'.MuiSelect-select': {color: '#919eab'}}}
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={isTrace}
                            label="Age"
                            onChange={handleTrace}
                            color="primary"
                        >
                            <MenuItem value={"#FFFFFF"}>White</MenuItem>
                            <MenuItem value={"#FFFF00"}>Yellow</MenuItem>
                            <MenuItem value={"#00FFFF"}>Aqua</MenuItem>
                            <MenuItem value={"#800080"}>Purple</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="settings-buttons">
                <Button variant="outlined" color="primary" onClick={handleApply}>Apply</Button>
                <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
            </div>
      </div>
  )
}

export default Setting