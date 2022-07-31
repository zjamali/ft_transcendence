import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Profile/Header";
import SideBar from "../../components/Profile/SideBar";
import Image from "next/image";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { User } from "../../utils/interfaces";
import Link from "next/link";
import Router, { useRouter } from "next/router";

const Users = () => {
	const { state, setMainUser } = useContext(AppContext);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const router = useRouter();

	useEffect(() => {
		axios
			.get("http://localhost:5000/users/me", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setMainUser({ ...res.data });
				}
				fetchAllUser();
			})
			.catch(() => {
				Router.push("/");
			});
	}, []);
	function fetchAllUser() {
		axios
			.get("http://localhost:5000/users", { withCredentials: true })
			.then((res) => {
				if (res.status === 200) {
					setAllUsers([...res.data]);
				}
			})
			.catch(() => {
				console.log("cant get user");
			});
	}
	return (
		<>
			{state.mainUser && (
						<div className="profile-content">
							{allUsers.length &&
								allUsers.map((user) => {
									return (
										<div key={user.id}>
											<Link
												href={{
                                                    pathname: 'users/[userId]',
                                                    query: { userId: `${user.id}` }
                                                }}
											>
												<a>{user.userName} </a>
											</Link>
										</div>
									);
								})}
						</div>
			)}
		</>
	);
};

export default Users;
