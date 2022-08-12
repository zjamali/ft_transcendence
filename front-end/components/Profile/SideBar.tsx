import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import cookies, { useCookies } from "react-cookie";
import { AppContext } from "../../context/AppContext";
import { eventsSocket } from "../../context/sockets";
import InviteGameModale from "../game/InviteGameModale";
import Portal from "./Portal";

const menu = [
	{
		path: "/",
		name: "Profile",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="sidebar-icon"
				viewBox="0 0 16 16"
			>
				<path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
			</svg>
		),
		active: true,
	},
	{
		path: "/chat",
		name: "Chat",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				className="sidebar-icon"
				viewBox="0 0 16 16"
			>
				<path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM7.194 6.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 6C4.776 6 4 6.746 4 7.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 9.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 6c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z" />
			</svg>
		),
		active: false,
	},
	{
		path: "/users",
		name: "Users",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="sidebar-icon"
				viewBox="0 0 16 16"
			>
				<path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
				<path
					fillRule="evenodd"
					d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"
				/>
				<path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
			</svg>
		),
		active: false,
	},
	{
		path: "/game",
		name: "Game",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="sidebar-icon"
				viewBox="0 0 16 16"
			>
				<path d="M11.5 6.027a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 1.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm-6.5-3h1v1h1v1h-1v1h-1v-1h-1v-1h1v-1z" />
				<path d="M3.051 3.26a.5.5 0 0 1 .354-.613l1.932-.518a.5.5 0 0 1 .62.39c.655-.079 1.35-.117 2.043-.117.72 0 1.443.041 2.12.126a.5.5 0 0 1 .622-.399l1.932.518a.5.5 0 0 1 .306.729c.14.09.266.19.373.297.408.408.78 1.05 1.095 1.772.32.733.599 1.591.805 2.466.206.875.34 1.78.364 2.606.024.816-.059 1.602-.328 2.21a1.42 1.42 0 0 1-1.445.83c-.636-.067-1.115-.394-1.513-.773-.245-.232-.496-.526-.739-.808-.126-.148-.25-.292-.368-.423-.728-.804-1.597-1.527-3.224-1.527-1.627 0-2.496.723-3.224 1.527-.119.131-.242.275-.368.423-.243.282-.494.575-.739.808-.398.38-.877.706-1.513.773a1.42 1.42 0 0 1-1.445-.83c-.27-.608-.352-1.395-.329-2.21.024-.826.16-1.73.365-2.606.206-.875.486-1.733.805-2.466.315-.722.687-1.364 1.094-1.772a2.34 2.34 0 0 1 .433-.335.504.504 0 0 1-.028-.079zm2.036.412c-.877.185-1.469.443-1.733.708-.276.276-.587.783-.885 1.465a13.748 13.748 0 0 0-.748 2.295 12.351 12.351 0 0 0-.339 2.406c-.022.755.062 1.368.243 1.776a.42.42 0 0 0 .426.24c.327-.034.61-.199.929-.502.212-.202.4-.423.615-.674.133-.156.276-.323.44-.504C4.861 9.969 5.978 9.027 8 9.027s3.139.942 3.965 1.855c.164.181.307.348.44.504.214.251.403.472.615.674.318.303.601.468.929.503a.42.42 0 0 0 .426-.241c.18-.408.265-1.02.243-1.776a12.354 12.354 0 0 0-.339-2.406 13.753 13.753 0 0 0-.748-2.295c-.298-.682-.61-1.19-.885-1.465-.264-.265-.856-.523-1.733-.708-.85-.179-1.877-.27-2.913-.27-1.036 0-2.063.091-2.913.27z" />
			</svg>
		),
		active: false,
	},
	{
		path: "/live",
		name: "Live",
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="sidebar-icon"
				viewBox="0 0 16 16"
			>
				<path d="m7.646 9.354-3.792 3.792a.5.5 0 0 0 .353.854h7.586a.5.5 0 0 0 .354-.854L8.354 9.354a.5.5 0 0 0-.708 0z" />
				<path d="M11.414 11H14.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h3.086l-1 1H1.5A1.5 1.5 0 0 1 0 10.5v-7A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v7a1.5 1.5 0 0 1-1.5 1.5h-2.086l-1-1z" />
			</svg>
		),
		active: false,
	},
];

const SideBar = ({check, setCheck} : {check : boolean ; setCheck : any }) => {
	const router = useRouter();
	const [path, setPath] = useState("/");
	const [sideMenu, setSideMenu] = useState([...menu]);
	console.log("PATH : ", router.pathname);
	const [invitSender, setInvitSender] = useState(null);
	const [senderSocketid, setSenderSocketid] = useState<string>("");

	const {
		state,
		setLogin,
		setMainUser,
		setMessages,
		setContacts,
		setChannels,
		setReceiver,
		setFriends,
		setIsUserJoinedChannel,
		setOnlineGames,
	} = useContext(AppContext);
	const [openInviteModal, setOpenInviteModal] = useState(false);
	const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

	useEffect(() => {
		const menu = [...sideMenu].map((item) => {
			return { ...item, active: false };
		});
		const newMenu = menu.map((item) => {
			return {
				...item,
				active: item.path === router.pathname ? true : false,
			};
		});
		setSideMenu(newMenu);
	}, [router.pathname]);

	useEffect(() => {
		eventsSocket.on("GAME_INVITATION", (sender) => {
			console.log("sender : ", sender);
			setInvitSender({ ...sender.user });
			setOpenInviteModal(true);
			setSenderSocketid(sender.senderSocket);
		});
		eventsSocket.on("YOU_LOG_OUT", (responce) => {
			console.log(
				"resived cookie :",
				responce,
				"  curreent cookies :",
				cookies.access_token
			);
			if (cookies.access_token === responce) {
				console.log("you must log out ");
				handleLogOut();
			}
		});
		eventsSocket.on("TURN_OF_INVITATION_MODAL", () => {
			setOpenInviteModal(false);
		});
		eventsSocket.on("game_invitation_accepted", (data) => {
			router.push(`/game?roomId=${data.room_id}`);
		});
		return () => {
			// eventsSocket.off("GAME_INVITATION");
			// eventsSocket.off("game_invitation_accepted");
		};
	}, []);

	const handleLogOut = () => {
		state.chatSocket?.close();
		state.eventsSocket?.close();
		removeCookie("access_token");
		setMainUser(null);
		setLogin(null);
		setMessages(null);
		setContacts(null);
		setChannels(null);
		setReceiver(null);
		setFriends(null);
		setMainUser(null);
		setIsUserJoinedChannel(null);
		setOnlineGames(null);
		setLogin(false);
		state.eventsSocket.close();
		state.chatSocket.close();
	};
	useEffect(() => {
		if (!state.login) router.push("/");
	}, [state.login]);

	useEffect(() => {
		console.log("cookies :::::", cookies.access_token);
	}, [cookies]);

	return (
		<aside className={check ? "sideBarActive": "sidebar"}>
			<div className="middle-sidebar">
				<ul className="sidebar-list" onClick={()=> setCheck(false)}>
					{sideMenu.map((item) => {
						return (
							<li
								key={sideMenu.indexOf(item)}
								className={
									item.active
										? "sidebar-list-item active"
										: "sidebar-list-item"
								}
							>
								<Link href={item.path}>
									<a className="sidebar-link ">
										{item.icon}
										<div
											className={
												item.active
													? "hidden-sidebar active"
													: "hidden-sidebar"
											}
										>
											{item.name}
										</div>
									</a>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
			{openInviteModal ? (
				<Portal>
					<InviteGameModale
						inviteSender={invitSender}
						setOpenInviteModal={setOpenInviteModal}
						senderSocketId={senderSocketid}
					/>
				</Portal>
			) : null}
		</aside>
	);
};

export default SideBar;
