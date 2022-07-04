import React, { useContext } from 'react'
import {useRef, useEffect } from 'react'
import chatPannelStyle from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import { isContact } from '../../utils/utils'
import RoomManagement from './ChannelManagemet'
import MessageComponent from './message'
import BlockUser from './blockUser'
import Reciever from './reciever'
import { ChatContext } from '../../context/chatContext'



export default function ChatPannel() {
  
  /// automatic scroll message
  const {state, setMessageinput} = useContext(ChatContext);
  const chatContainer = useRef<HTMLDivElement>(null)
  return (
    <div className={chatPannelStyle.message}>
      <div className={chatPannelStyle.message_head}>
        <div className={chatPannelStyle.reciverInfo}>
          <Reciever  />
        </div>
        {state.receiver &&
          (isContact(state.receiver) ? (
           ''
            ) : (
            <RoomManagement/>
          ))}
      </div>
      <div className={chatPannelStyle.message_body}>
        <div ref={chatContainer} className={chatPannelStyle.messages_list}>
          {state.meassages &&
            state.meassages.map((message : any) => {
              return <MessageComponent key={uniqid()} message={message} mainUser={state.mainUser} />
            })}
        </div>
        <div className={chatPannelStyle.message_input}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("send message");
              setMessageinput('');
            }}
          >
            <input
              type="text"
              name="message"
              id="message_content"
              value={state.input_message}
              onChange={(e) => {
                setMessageinput(e.target.value);
              }}
            />
            <button type="submit">
              <img
                src="/images/icons/send_icon.png"
                alt="send"
                width={30}
                height={30}
              />{' '}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
