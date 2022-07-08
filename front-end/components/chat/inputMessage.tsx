import React from 'react'
import inputMessageStyle from '../../styles/Chat.module.css'
interface InputMessageInterface {
    sendMessage: (e: any)=>void ;
    messageInput: string;
    setMessageinput: (e :any)=>void
}

export function InputMessage ({sendMessage ,messageInput, setMessageinput } : InputMessageInterface) {
  return (
    <div className={inputMessageStyle.message_input}>
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
  )
}