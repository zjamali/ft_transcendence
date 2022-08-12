import Image from "next/image";
import DefaultData from "./DefaultData";
import EditModal from "./EditModal";
import { useContext, useState, useEffect } from "react";
import Portal from "./Portal";
import FriendsList from "./FriendsList";
import HistoryList from "./HistoryList";
import { AppContext } from "../../context/AppContext";
import MainUserNav from "./MainUserNav";
import Router, { useRouter } from "next/router";
import Active2FA from "../2FA/create2FA";

const Profile = () => {
	const [active, setActive] = useState<String>("DefaultData");
	const router = useRouter();
	// console.log("edit_profile : ", Router.query["edit_profile"]);
	const [openModal, setOpenModal] = useState<Boolean>(
		router.query.edit_profile ? true : false
	);
	const [open2FAModal, setOpen2FAModal] = useState<Boolean>(false);

	const { state } = useContext(AppContext);
	const renderComponent = (active: String) => {
		switch (active) {
			case "DefaultData":
				return <DefaultData id={state.mainUser.id} />;
			case "Friends":
				return <FriendsList />;
			case "History":
				return <HistoryList  id={state.mainUser.id} />;
		}
	};
	useEffect(() => {
		console.log(state.mainUser);
	}, []);

	useEffect(() => {
		setOpenModal(router.query.edit_profile ? true : false);
	}, [router]);
	useEffect(() => {
		if (!openModal) Router.push("/");
	}, [openModal]);

	const src = state.mainUser?.image;

	console.log("path------------>", src);
	return (
		<div className="profile-content">
			<div className="profile-wall">
				<div className="profile-wall-bg">
          <Image src="/xo.jpeg" alt="image_navbar" objectFit="cover" />
        </div>
				<div className="profile-wall-img-user">
					<Image
						loader={() => src}
						unoptimized={true}
						src={src}
						alt="user avatar"
						layout="fill"
					/>
					{/* <img src={state.mainUser.image} className="profile-wall-img-user" /> */}
				</div>
				<MainUserNav
					setActive={setActive}
					setOpenModal={setOpenModal}
				/>
				{/* <OtherUserNav /> */}
			</div>
			{renderComponent(active)}
			{/* </div> */}
			{openModal ? (
				<Portal>
					<EditModal closeModal={setOpenModal} setOpen2FAModal={setOpen2FAModal} />
				</Portal>
			) : null}
			{open2FAModal ? (
				<Portal>
					<Active2FA closeModal2FA={setOpen2FAModal} />
				</Portal>
			) : null}
			{/* </div> */}
		</div>
	);
};

export default Profile;
