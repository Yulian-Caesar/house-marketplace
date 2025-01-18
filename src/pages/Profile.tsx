import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import app from "../firebase.config";

type UserType = {
	displayName?: string | null
}

export const Profile = () => {
	const [user, setUser] = useState<UserType | null>(null)
	const auth = getAuth(app);
	console.log(user)
	useEffect(() => {
		setUser(auth.currentUser ? auth.currentUser : null);
	}, [auth])

	return user ? <h1>{user.displayName}</h1> : <h1>Not log in</h1>;
}
