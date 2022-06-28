import messageStyles from '../../styles/Chat.module.css'
import { MessageComponentProps } from './interfaces'

export default function MessageComponent(props: MessageComponentProps) {

  return (
    <>
      { props.mainUser?.id === props.message?.creator_id ? (
        <div
          className={
            messageStyles.message_content +
            ' ' +
            messageStyles.message_main_user
          }
        >
          <p>{props.message?.content}</p>
        </div>
      ) : (
        <div className={messageStyles.message_content}>
          <p>{props.message?.content}</p>
        </div>
      )}
    </>
  )
}
