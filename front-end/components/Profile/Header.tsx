import Image from 'next/image'
// import intra from '../../..//public/42.jpg'
import logoImg from '../../public/ponglogo.svg'
import DropDown from './DropDown'
import DropDNotifications from './DropDNotifications'
import { useContext } from 'react'
import { ChatContext } from '../../context/chatContext'

const Header = () => {
  const {state} = useContext(ChatContext)
  const userName: string = state.mainUser.userName
  const src: string = state.mainUser.image

  return (
    <header className="header">
      <div className="logo-container">
        <Image
          src={logoImg}
          className="img-logo"
          alt="this is the logo"
          layout="fill"
        />
      </div>
      <div className="left-items">
        <div className="notifications-container">
          <DropDNotifications />
        </div>
        <div className="user-container">
          <DropDown userName={userName} image={src}/>
        </div>
      </div>
    </header>
  )
}

export default Header
