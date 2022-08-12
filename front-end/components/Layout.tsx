import { useEffect, useState } from "react";
import { AppConsumer } from "../context/AppContext";
import { chatSocket, eventsSocket } from "../context/sockets";
import HomePage from "../pages/HomePage";
import Header from "./Profile/Header";
import SideBar from "./Profile/SideBar";
import { useRouter } from "next/router";

export default function Layout(props: any) {
	const router = useRouter();
	const [check, setCheck] = useState<boolean>(false)
	console.log("router : >> ", router.pathname);
	useEffect(() => {

		return () => {

		};
	}, []);

	return (
		<AppConsumer>
			{({ state, setMainUser }) => {
				if (!state.login) {
					return <HomePage />;
				} else {
					return (
						<div>
							{state.mainUser && (
								<Header
									state={state}
									setMainUser={setMainUser}
									setCheck={setCheck}
									check={check}
								/>
							)}
							<div className="profile-container">
								<SideBar setCheck={setCheck} check={check}/>
								{/* <div className="profile-content"> */}
								{props.children}
								{/* </div> */}
							</div>
						</div>
					);
				}
			}}
		</AppConsumer>
	);
}
