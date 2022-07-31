import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppProvider from "../context/AppContext";
import Modal from "react-modal";
import dynamic from "next/dynamic";
// import '../styles/globals.css'
// import "../styles/LandingPage.css"
import "../styles/Profile.css";
import Head from "next/head";
import Layout from "../components/Layout";

Modal.setAppElement("#__next");
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AppProvider>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, height=device-height initial-scale=1.0"
				/>
			</Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</AppProvider>
	);
}
export default dynamic(() => Promise.resolve(MyApp), {
	ssr: false,
});

//export default MyApp
