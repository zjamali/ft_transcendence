import { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'
import blockUserStyle from '../../styles/Chat.module.css'

export default function BlockUser() {
  const {state} = useContext(ChatContext);
  return (
    <div className={blockUserStyle.block_user}>
      <button className={blockUserStyle.block_user_button}>{"block"}</button>
    </div>
  )
}
