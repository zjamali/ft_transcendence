import React, { useState, useContext } from 'react'
import chatSideBar from '../../styles/Chat.module.css'
import MainUser from './mainUser'
import ChatContacts from './chatContacts'
import ChatRooms from './channelsChat'
import {AppContext} from '../../context/AppContext'

export default function ChatSideBar() {
  const [buttonState, setButtonState] = useState(0)
  const hangleToogle = (e: any) => {
    if (e.target.id === 'contacts') {
      setButtonState(0)
    } else if (e.target.id === 'channels') {
      setButtonState(1)
    }
  }


  return (
    <div className={chatSideBar.chatSideBar}>
      <MainUser/>
      <div>
        <div className={chatSideBar.chatSwitchButtons}>
          <button
            className={
              buttonState === 0
                ? chatSideBar.btn_toogle + ' ' + chatSideBar.selected_btn
                : chatSideBar.btn_toogle
            }
            onClick={(e) => {
              hangleToogle(e)
            }}
            id="contacts"
          >
            Direct Messages
          </button>
          <button
            className={
              buttonState === 1
                ? chatSideBar.btn_toogle + ' ' + chatSideBar.selected_btn
                : chatSideBar.btn_toogle
            }
            onClick={hangleToogle}
            id="channels"
          >
            Channels
          </button>
        </div>
        {buttonState === 0 && <ChatContacts />}
        {buttonState === 1 && <ChatRooms/>}
      </div>
    </div>
  )
}
