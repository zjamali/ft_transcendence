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
import NotFound from "../../notFound";

type Props = {};

export default function UserProfile({}: Props) {
	const [user, setUser] = useState<User | null>(null);
	const [userFriends, setUserFriends] = useState([]);
	const { state, setMainUser, friends } = useContext(AppContext);
	const router = useRouter();
	const { userId } = router.query;
	useEffect(() => {
    try{

      axios
        .get(`${process.env.SERVER_HOST}/users/me`, { withCredentials: true })
        .then((res) => {
          if (res.status === 200) {
            setMainUser({ ...res.data });
            userData();
          }
        })
        .catch(() => {
          
        });
    }catch(e){

    }

		state.eventsSocket.on("UPDATE_DATA", () => {
			axios
				.get(`${process.env.SERVER_HOST}/users/me`, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.status === 200) {
						setMainUser({ ...res.data });
						userData();
					}
				})
				.catch(() => {
          setMainUser(null);
					
				});
		});
		return () => {
			state.eventsSocket.off("A_PROFILE_UPDATE");
		};
	}, []);

	function userData() {
		axios
			.get(`${process.env.SERVER_HOST}/users/id/${userId}`, {
				withCredentials: true,
			})
			.then(async (res) => {
				if (res.status === 200) {
						setUser({ ...res.data });
				}
				else
					setUser(null);
			})
			.catch(() => {
				
			});
	}
	async function fetchUsersBlockedBy() {
		return await axios.get(`${process.env.SERVER_HOST}/users/blockedByUsers`, {
			withCredentials: true,
		});
	}

	
	return (
		<>
			{state.mainUser && user ? (
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
						</div>
						{user && (
							<OtherUserNav
								userName={user.userName}
								id={user.id}
							/>
						)}
					</div>
					<DefaultData id={userId} />
				</div>
			) : (
				<NotFound />
			)}
		</>
	);
}
