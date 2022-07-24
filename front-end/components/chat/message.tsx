import { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../../context/chatContext'
import messageStyles from '../../styles/Chat.module.css'
import { MessageComponentProps } from '../../utils/interfaces'
import { isContact } from '../../utils/utils'

export default function MessageComponent(props: MessageComponentProps) {
  const { state } = useContext(ChatContext)
  const [isChannel, setIsChannel] = useState<boolean>(false)

  useEffect(() => {
    setIsChannel(!isContact(state.receiver))
  }, [state.receiver])

  return (
    <>
      {props.mainUser?.id === props.message?.senderId ? (
        <>
          <div
            className={
              messageStyles.message_content +
              ' ' +
              messageStyles.message_main_user
            }
          >
            <pre>{props.message?.content}</pre>
          </div>
          {/* <p className={messageStyles.Channel_senderName}>{`   `}</p> */}
        </>
      ) : (
        <>
          <div className={messageStyles.message_content}>
            <p>{props.message?.content}</p>
            {isChannel && (
              <h5 className={messageStyles.Channel_senderName}>
                {' '}
                ➦ {props.message.senderName}
              </h5>
            )}
          </div>
          {/* {isChannel ? (
            <p className={messageStyles.Channel_senderName}>
              {props.message.senderName}
            </p>
          ) : (
            <p className={messageStyles.Channel_senderName}>{`   `}</p>
          )} */}
        </>
      )}
    </>
  )
}
