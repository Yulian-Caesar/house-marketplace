import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc, collection, getDocs, query, where, orderBy, deleteDoc, limit } from "firebase/firestore";
import { app, db } from "../firebase.config.ts";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg";
import HomeIcon from "../assets/svg/homeIcon.svg";
import { ListingsType } from "../components/Slider";
import { ListingItem, ListingType } from "../components/ListingItem";

type UserType = {
	name?: string | null
	email?: string | null
}

export const Profile = () => {
	const auth = getAuth(app);
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState<ListingsType[]>([])
	const [changeDetails, setChangeDetails] = useState(false)
	const [formData, setFormData] = useState<UserType | null>({
		name: auth.currentUser?.displayName || null,
		email: auth.currentUser?.email || null
	})
	const {name, email} = formData as UserType;

	const navigate = useNavigate();

	const onLogout = () => {
		auth.signOut()
		navigate('/')
	}

	useEffect(() => {
		const fetchUserListings = async() => {
			const listingsRef = collection(db, 'listings');
			const q = query(listingsRef, where('userRef', '==', auth.currentUser?.uid), orderBy('timestamp', 'desc'), limit(5))
			const querySnap = await getDocs(q);

			const listings: ListingsType[] = [];
			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data() as ListingType
				})
			})
			setListings(listings)
			setLoading(false)
		}
		fetchUserListings()
	}, [auth.currentUser?.uid])

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

	const onDelete = async (listingId: string) => {
		if(window.confirm('Are you sure you want to delete?')) {
			await deleteDoc(doc(db, 'listings', listingId))
			const updatedListings = listings.filter(listing => listing.id !== listingId)
			setListings(updatedListings)
			toast.success('Successfully deleted listing')
		}
	}

	const onEdit = (listingId: string) => navigate(`/edit-listing/${listingId}`)

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

			{!loading && listings?.length > 0 && (
				<>
					<p className="listingText">Your Listings</p>
					<ul className="listingsList">
						{listings.map(listing => (
							<ListingItem 
								key={listing.id} 
								id={listing.id} 
								listing={listing.data} 
								onDelete={() => onDelete(listing.id)} 
								onEdit={() => onEdit(listing.id)} 
							/>
						))}
					</ul>
				</>
			)}

		</main>
	</div>
}
