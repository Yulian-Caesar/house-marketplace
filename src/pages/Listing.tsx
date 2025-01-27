import { useEffect, useState } from 'react'
import shareIcon from '../assets/svg/shareIcon.svg'
import { Link, useNavigate, useParams } from 'react-router';
import app, {db} from "../firebase.config";
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Spinner } from '../components/Spinner';

export const Listing = () => {
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth(app);

	useEffect(() => {
		const fetchListing = async() => {
			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef)

			if(docSnap.exists()) {
				console.log(docSnap.data())
				setListing(docSnap.data())
				setLoading(false)
			}
		}

		fetchListing()
	}, [navigate, params.listingId])

	if(loading) return <Spinner />

	return (
		<main>
			{/* Slider */}

			<div className="shareIconDiv" onClick={() => {
				navigator.clipboard.writeText(window.location.href)
				setShareLinkCopied(true)
				setTimeout(() => {
					setShareLinkCopied(false)
				}, 2000)
			}}>
				<img src={shareIcon} alt="Share" />
			</div>
			{shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

			<div className="listingDetails">
				<p className='listingName'>
					{listing.name} - ${listing.offer ? listing.discountedPrice : listing.regularPrice}
				</p>
				<p className="listingLocation">{listing.location}</p>
				<p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
				{listing.offer && (
					<p className="discountPrice">
						${listing.regularPrice - listing.discountedPrice} discount
					</p>
				)}

				<ul className="listingDetailsList">
					<li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
					<li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
					<li>{listing.parking && 'Parking Spot'}</li>
					<li>{listing.furnished && 'Furnished'}</li>
				</ul>

				<p className="listingLocationTitle">Location</p>
				{/* Map */}

				{auth.currentUser?.uid !== listing.userRef && (
					<Link to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`} className='primaryButton'>Contact Landlord</Link>
				)}
			</div>
		</main>
	)
}