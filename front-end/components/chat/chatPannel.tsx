import React, { useContext, useState } from 'react'
import { useRef, useEffect } from 'react'
import chatPannelStyle from '../../styles/Chat.module.css'
import uniqid from 'uniqid'
import { isContact } from '../../utils/utils'
import ChannelManagement from './ChannelManagemet'
import MessageComponent from './message'
import Reciever from './reciever'
import { ChatContext } from '../../context/chatContext'
import io, { Socket } from 'socket.io-client'
import { Message } from '../../utils/interfaces'

export default function ChatPannel() {
  //chat socket if a reciver is set
  const chatSocket = useRef<any>(null)

  /// automatic scroll message
  const { state } = useContext(ChatContext)
  const chatContainer = useRef<HTMLDivElement>(null)
  const [messageInput, setMessageinput] = useState<string>('')
  const messagesList = useRef<any>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    //////
    /* creation Sockets start */
    if (!chatSocket.current)
      chatSocket.current = io('http://localhost:5000/chat', {
        withCredentials: true,
      })

    try {
      chatSocket.current.on('NEW_MESSAGE', (newMessage: any) => {
        console.log('wa message : ', newMessage);
        console.log('reciever : ', state.receiver);
        if (state.receiver.id === newMessage.senderId) {
          console.log('all messages: ', messages);
          //setMessages([...state.messages , {...message}]);
          console.log("new message : ", newMessage)
          messagesList.current = [...messagesList.current , newMessage];
          setMessages([...messagesList.current]);
        }
      })
    } catch (error) {
      console.log('sockets error', error)
    }

    return () => {
      console.log('close sockets')
      chatSocket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    console.log("receiver changed");
  }, [state.receiver])
  

  const sendMessage = (e: any) => {
    e.preventDefault()
    console.log('send message')
    const message = {
      senderId: state.mainUser.id,
      senderName: `${state.mainUser.firstName} ${state.mainUser.lastName}`,
      receiverId: state.receiver.id,
      createdAt: Date(),
      content: messageInput,
      isChannel: false,
    }
    messagesList.current = [...messagesList.current , message];
    setMessages([...messagesList.current]);
    chatSocket.current.emit('SEND_MESSAGE', { ...message })
    setMessageinput('')
  }

  return (
    <div className={chatPannelStyle.message}>
      <div className={chatPannelStyle.message_head}>
        <div className={chatPannelStyle.reciverInfo}>
          <Reciever />
        </div>
        {state.receiver &&
          (isContact(state.receiver) ? '' : <ChannelManagement />)}
      </div>
      <div className={chatPannelStyle.message_body}>
        <div ref={chatContainer} className={chatPannelStyle.messages_list}>
          {/* {state.messages &&
            state.messages.map((message : any) => {
              return <MessageComponent key={uniqid()} message={message} mainUser={state.mainUser} />
            })} */}
          {messages &&
            messages.map((message: any) => {
              return (
                <MessageComponent
                  key={uniqid()}
                  message={message}
                  mainUser={state.mainUser}
                />
              )
            })}
        </div>
        <div className={chatPannelStyle.message_input}>
          <form
            onSubmit={(e) => {
              sendMessage(e)
            }}
          >
            <input
              type="text"
              name="message"
              id="message_content"
              value={messageInput}
              onChange={(e) => {
                setMessageinput(e.target.value)
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
