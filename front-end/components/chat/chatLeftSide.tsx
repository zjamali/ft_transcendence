import React, { useState, useContext } from 'react'
import chatLeftStyles from '../../styles/Chat.module.css'
import MainUser from './mainUser'
import ChatContacts from './chatContacts'
import ChatRooms from './chatRooms'
import {ChatContext} from '../../context/chatContext'

export default function ChatLeftSide(props: any) {
  const [buttonState, setButtonState] = useState(0)
  const hangleToogle = (e: any) => {
    if (e.target.id === 'contacts') {
      setButtonState(0)
    } else if (e.target.id === 'rooms') {
      setButtonState(1)
    }
  }

  /* */
  const {state} = useContext(ChatContext);
  /* */

  return (
    <div className={chatLeftStyles.chatRightSide}>
      <MainUser/>
      <div>
        <div className={chatLeftStyles.chatSwitchButtons}>
          <button
            className={
              buttonState === 0
                ? chatLeftStyles.btn_toogle + ' ' + chatLeftStyles.selected_btn
                : chatLeftStyles.btn_toogle
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
                ? chatLeftStyles.btn_toogle + ' ' + chatLeftStyles.selected_btn
                : chatLeftStyles.btn_toogle
            }
            onClick={hangleToogle}
            id="rooms"
          >
            Rooms
          </button>
        </div>
        {buttonState === 0 && <ChatContacts  />}
        {buttonState === 1 && <ChatRooms />}
      </div>
    </div>
  )
}
