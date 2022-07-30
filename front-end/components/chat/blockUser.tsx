import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import blockUserStyle from '../../styles/Chat.module.css'

export default function BlockUser() {
  const {state} = useContext(AppContext);
  return (
    <div className={blockUserStyle.block_user}>
      <button className={blockUserStyle.block_user_button}>{"block"}</button>
    </div>
  )
}
