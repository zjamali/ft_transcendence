import '../styles/globals.css'
import type { AppProps } from 'next/app'
import ChatProvider from '../context/AppContext'
import Modal from 'react-modal'
// import '../styles/globals.css'
// import "../styles/LandingPage.css"
import "../styles/Profile.css"
import Head from 'next/head'


Modal.setAppElement('#__next');
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChatProvider>
      <Head>
		    <meta name="viewport" content="width=device-width, height=device-height initial-scale=1.0"/>
    	</Head>
      <Component {...pageProps} />
    </ChatProvider>
  )
}

export default MyApp
