import { AppConsumer } from "../context/AppContext";
import HomePage from "../pages/HomePage";
import Header from "./Profile/Header";
import SideBar from "./Profile/SideBar";

export default function Layout(props: any) {
	return (
		<AppConsumer>
			{({ state}) => {
				if (!state.login) {
					return <HomePage/>;
				} else {
					return (
						<div>
							<Header />
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
