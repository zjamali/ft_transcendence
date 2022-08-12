import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../../components/Profile/Header";
import SideBar from "../../../components/Profile/SideBar";
import { AppContext } from "../../../context/AppContext";
import Image from "next/image";
import OtherUserNav from "../../../components/Profile/OtherUserNav";
import { User } from "../../../utils/interfaces";
import { useRouter } from "next/router";
import DefaultData from "../../../components/Profile/DefaultData";
import NotFound from "../../404";

type Props = {};

export default function UserProfile({}: Props) {
	const [user, setUser] = useState<User | null>(null);
	const { state, setMainUser, friends } = useContext(AppContext);
	const router = useRouter();
	const [userId, setUserId] = useState<any>(null);
	useEffect(() => {
		const { userId } = router.query;
		setUserId(userId);
	}, [router]);

	useEffect(() => {
		if (userId) {
			try {
				axios
					.get(`${process.env.SERVER_HOST}/users/me`, {
						withCredentials: true,
					})
					.then((res) => {
						if (res.status === 200) {
							setMainUser({ ...res.data });
							userData(userId);
						}
					})
					.catch(() => {});
			} catch (e) {}
			state.eventsSocket.on("UPDATE_DATA", () => {
				console.log("user id :", userId);
				axios
					.get(`${process.env.SERVER_HOST}/users/me`, {
						withCredentials: true,
					})
					.then((res) => {
						if (res.status === 200) {
							setMainUser({ ...res.data });
							userData(userId);
						}
					})
					.catch(() => {});
			});
		}
	}, [userId]);

	function userData(userId: any) {
		axios
			.get(`${process.env.SERVER_HOST}/users/id/${userId}`, {
				withCredentials: true,
			})
			.then(async (res) => {
				if (res.status === 200) {
					if (res.data.id === state.mainUser.id)
						router.push("/");
					else
						setUser({ ...res.data });
				}
				if (res.status === 403)
					setUser(null);
			})
			.catch((error) => {
				setUser(null);
				console.log("user not found");
			});
	}

	return (
		<>
			{state.mainUser && user ? (
				<div className="profile-content">
					<div className="profile-wall">
          <div className="profile-wall-bg">
          <Image loader={() => "/xo.jpeg"} src="/xo.jpeg" unoptimized={true} alt="image_navbar" layout="fill" objectFit="cover" />
        </div>
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
						</div>
						{user && (
							<OtherUserNav
								userName={user.userName}
								id={user.id}
							/>
						)}
					</div>
					<DefaultData id={user.id} />
				</div>
			) : (
				<NotFound />
			)}
		</>
	);
}
