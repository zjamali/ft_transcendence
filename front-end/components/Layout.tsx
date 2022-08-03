import { useEffect, useState } from "react";
import { AppConsumer } from "../context/AppContext";
import HomePage from "../pages/HomePage";
import { User } from "../utils/interfaces";
import Header from "./Profile/Header";
import SideBar from "./Profile/SideBar";

export default function Layout(props: any) {
	return (
		<AppConsumer>
			{({ state , setMainUser}) => {
				if (!state.login) {
					return <HomePage />;
				} else {
					
					return (
						<div>
							{state.mainUser && <Header state={state} setMainUser={setMainUser} />}
							<div className="profile-container">
								<SideBar />
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
