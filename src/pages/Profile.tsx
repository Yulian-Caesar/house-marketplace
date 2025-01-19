import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import app, { db } from "../firebase.config";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import HomeIcon from "../assets/svg/homeIcon.svg";


type UserType = {
	name?: string | null
	email?: string | null
}

export const Profile = () => {
	const auth = getAuth(app);
	const [changeDetails, setChangeDetails] = useState(false)
	const [formData, setFormData] = useState<UserType | null>({
		name: auth.currentUser?.displayName || null,
		email: auth.currentUser?.email || null
	})
	const {name, email} = formData;

	const navigate = useNavigate();

	const onLogout = () => {
		auth.signOut()
		navigate('/')
	}

	const onSubmit = async() => {
		try {
			if(auth.currentUser?.displayName !== name) {
				// Update displayName in fb
				if(auth.currentUser) {
					await updateProfile(auth.currentUser, {
						displayName: name
					})
				}


				// Update in Firestore
				if(auth.currentUser) {
					const userRef = doc(db, 'users', auth.currentUser.uid);
					await updateDoc(userRef, {
						name
					})
				}
			}
		} catch {
			toast.error('Could not update profile details')
		}
	}

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(prevState => ({
			...prevState,
			[e.target.id]: e.target.value
		}))
	}

	return <div className="profile">
		<header className="profileHeader">
			<p className="pageHeader">My Profile</p>
			<button type="button" className="logOut" onClick={onLogout}>Logout</button>
		</header>

		<main>
			<div className="profileDetailsHeader">
				<p className="profileDetailsText">Personal Details</p>
				<p className="changePersonalDetails" onClick={() => {
					if(changeDetails) {
						onSubmit();
					}
					setChangeDetails(prevState => !prevState)
				}}>
					{changeDetails ? 'Done' : 'Change'}
				</p>
			</div>

			<div className="profileCard">
				<form action="">
					<input 
						type="text" 
						id="name" 
						className={changeDetails ? 'profileNameActive' : 'profileName'}
						disabled={!changeDetails}
						value={name}
						onChange={onChange}
					/>
					<input 
						type="text" 
						id="email" 
						className={changeDetails ? 'profileEmailActive' : 'profileEmail'}
						disabled={!changeDetails}
						value={email}
						onChange={onChange}
					/>
				</form>
			</div>

			<Link to='/create-listing' className="createListing">
				<img src={HomeIcon} alt="home" />
				<p>Sell or rent your home</p>
				<img src={ArrowRightIcon} alt="arrow right" />
			</Link>
		</main>
	</div>
}
