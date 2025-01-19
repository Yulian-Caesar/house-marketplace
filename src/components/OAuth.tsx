
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import app, { db } from "../firebase.config";
import googleIcon from "../assets/svg/googleIcon.svg"
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

export const OAuth = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const onGoogleClick = async() => {
		try {
			const auth = getAuth(app)
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			// Check for user
			const docRef = doc(db, 'users', user.uid)
			const docSnap = await getDoc(docRef)

			if(!docSnap.exists()) {
				// if user doesn't exist in Firebase, create user
				await setDoc(doc(db, 'users', user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp:  serverTimestamp()
				})
			}
			navigate('/')
		} catch {
			toast.error('Could not authorize woth Google')
		}
	}

	return <div className="socialLogin">
		<p>Sign {location.pathname === '/sign-up'? 'up' : 'in'} with</p>
		<button className="socialIconDiv" onClick={onGoogleClick}>
			<img src={googleIcon} alt="google" className="socialIconImg" />
		</button>
	</div>
}
