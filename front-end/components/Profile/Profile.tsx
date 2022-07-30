import Image from 'next/image'
import Header from './Header'
import SideBar from './SideBar'
import intra from '../../public/42.jpg'
import DefaultData from './DefaultData'
import EditModal from './EditModal'
import { useContext, useState,useEffect } from 'react'
import Portal from './Portal'
import FriendsList from './FriendsList'
import HistoryList from './HistoryList'
import { AppContext } from '../../context/AppContext'
import MainUserNav from './MainUserNav'
import OtherUserNav from './OtherUserNav'

const Profile = () => {
  const [active, setActive] = useState<String>('DefaultData')
  const [openModal, setOpenModal] = useState<Boolean>(false)
  
  const {state} = useContext(AppContext)
  const renderComponent = (active: String) => {
		switch (active) {
		case 'DefaultData':
			return <DefaultData />
		case 'Friends':
			return <FriendsList />
		case 'History':
				return <HistoryList />
		}
	}
	useEffect(() => {
		console.log(state.mainUser);
	}, [])

	const src = state.mainUser.image;

	return (
	<div>
		<Header />
		<div className="profile-container">
			<SideBar />
			<div className="profile-content">
				<div className="profile-wall">
					<div className="profile-wall-bg"></div>
					<div className="profile-wall-img-user">
						<Image loader={()=> src} unoptimized={true} src={src} alt="user avatar" layout="fill" />
						{/* <img src={state.mainUser.image} className="profile-wall-img-user" /> */}
					</div>
					{/* <MainUserNav setActive={setActive} setOpenModal={setOpenModal}/> */}
					<OtherUserNav />
				</div>
				{renderComponent(active)}
			</div>
			{
				openModal ? (
					<Portal>
						<EditModal closeModal={setOpenModal} />
					</Portal>
				) : null
			}
		</div>
	</div>
  )
}

export default Profile
