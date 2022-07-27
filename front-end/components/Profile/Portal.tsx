import {ReactNode, useEffect, useState } from "react"
import {createPortal} from "react-dom"

type PortalProps = {
	children?: ReactNode
}

const Portal: React.FC<PortalProps>  = ({children}) => {
	const [mounted, setMounted] = useState(false)

	useEffect( () => {
		setMounted(true)
		return () => setMounted(false)
	}, [])

	return (
		mounted ? createPortal(children, document.querySelector("#portal") as HTMLElement) : null
	)
}

export default Portal
