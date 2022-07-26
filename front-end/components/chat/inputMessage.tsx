/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import inputMessageStyle from '../../styles/Chat.module.css'
interface InputMessageInterface {
  sendMessage: (e: any, inputMessage: string) => void
  // messageInput: string
  // setMessageinput: (e: any) => void
}

export function InputMessage({
  sendMessage,
}: // messageInput,
// setMessageinput,
InputMessageInterface) {
  const { state } = useContext(ChatContext)

  useEffect(() => {
    // just the receiver changed
  }, [state.receiver])

  const handleMessage = (e: any) => {
    e.preventDefault()

    if (!/^\s+$/g.test(messageInput) && messageInput.length) {
      sendMessage(e, messageInput)
      setMessageinput('')
    }
  }

  const [messageInput, setMessageinput] = useState<string>('')

  return (
    <div className={inputMessageStyle.message_input}>
      <form
        onSubmit={(e) => {
          handleMessage(e)
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
  )
}
