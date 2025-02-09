import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../firebase.config.ts";

export const useAuthStatus = () => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [checkingStatus, setCheckingStatus] = useState(true)

	useEffect(() => {
		const auth = getAuth(app)
		onAuthStateChanged(auth, (user) => {
			if(user) {
				setLoggedIn(true)
			}
			setCheckingStatus(false)
		})
	})

	return {loggedIn, checkingStatus}
}