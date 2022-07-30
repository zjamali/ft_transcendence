import Image from 'next/image'
// import intra from '../../..//public/42.jpg'
import logoImg from '../../public/ponglogo.svg'
import DropDown from './DropDown'
import DropDNotifications from './DropDNotifications'
import { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../../context/AppContext'
import { io } from 'socket.io-client'

const Header = () => {
  const {state} = useContext(AppContext)
  const userName: string = state.mainUser.userName
  const src: string = state.mainUser.image

  useEffect(() => {
    if (!state.eventsSocket.current) {
			state.eventsSocket.current = io("http://localhost:5000/events", {
				withCredentials: true,
			});
		}
  }, [])
  

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
