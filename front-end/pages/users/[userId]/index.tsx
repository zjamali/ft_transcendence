import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../components/Profile/Header";
import SideBar from "../../../components/Profile/SideBar";
import { AppContext } from "../../../context/AppContext";
import Image from "next/image";
import OtherUserNav from "../../../components/Profile/OtherUserNav";
import { User } from "../../../utils/interfaces";
import { useRouter } from "next/router";
import DefaultData from "../../../components/Profile/DefaultData"


export default function UserProfile() {
	const [user, setUser] = useState<User | null>(null);
	const { state, setMainUser } = useContext(AppContext);
	const roote = useRouter();
	const { userId } = roote.query;
	useEffect(() => {
		axios
			.get("http://localhost:5000/users/me", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
					userData();
				}
			})
			.catch(() => {
				console.log("ee");
			});
	}, []);

	function userData() {
		axios
			.get(`http://localhost:5000/users/id/${userId}`, {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status === 200) {
					setUser({ ...res.data });
				}
			})
			.catch(() => {
				console.log("eee");
			});
	}

	return (
		<>
			{state.mainUser && user && (
						<div className="profile-content">
							<div className="profile-wall">
								<div className="profile-wall-bg"></div>
								<div className="profile-wall-img-user">
									{user && (
										<Image
											loader={() => `${user.image}`}
											unoptimized={true}
											src={`${user.image}`}
											alt="user avatar"
											layout="fill"
										/>
									)}
									{/* <img src={user.image} alt="user image" /> */}
									{/* <img src={state.mainUser.image} className="profile-wall-img-user" /> */}
								</div>
								{/* <MainUserNav setActive={setActive} setOpenModal={setOpenModal}/> */}
								<OtherUserNav />
							</div>
								<DefaultData />
						</div>
			)}
		</>
	);
}
