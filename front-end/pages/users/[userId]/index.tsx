import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../components/Profile/Header";
import SideBar from "../../../components/Profile/SideBar";
import { ChatContext } from "../../../context/chatContext";
import Image from "next/image";
import OtherUserNav from "../../../components/Profile/OtherUserNav";
import { User } from "../../../utils/interfaces";
import { useRouter } from "next/router";

type Props = {};

export default function UserProfile({}: Props) {
	const [user, setUser] = useState<User | null>(null);
	const { state, setMainUser } = useContext(ChatContext);
    const root = useRouter();

	useEffect(() => {
		axios
			.get("http://localhost:5000/users/me", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
                    console.log("root :",root);
					userData();
				}
			})
			.catch(() => {
				console.log("ee");
			});
	}, []);

	function userData() {
		axios
			.get(`http://localhost:5000/users/me`, { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setUser({ ...res.data });
				}
			})
			.catch(() => {
				console.log("eee");
			});
	}

    const src = state.mainUser?.image;

    return (
		<>
			{state.mainUser && (
				<div>
					<Header />
					<div className="profile-container">
						<SideBar />
						<div className="profile-content">
							<div className="profile-wall">
								<div className="profile-wall-bg"></div>
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
								{/* <MainUserNav setActive={setActive} setOpenModal={setOpenModal}/> */}
								<OtherUserNav />
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
