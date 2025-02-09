import { useEffect, useState } from 'react'
import shareIcon from '../assets/svg/shareIcon.svg'
import { Link, useNavigate, useParams } from 'react-router';
import { app, db } from "../firebase.config.ts";
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Spinner } from '../components/Spinner';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { ListingType } from "../types";
import { toast } from 'react-toastify';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'

export const Listing = () => {
	const [listing, setListing] = useState<ListingType | null>(null);
	const [loading, setLoading] = useState(true);
	const [shareLinkCopied, setShareLinkCopied] = useState(false);

	const navigate = useNavigate();
	const params = useParams();
	const auth = getAuth(app);

	useEffect(() => {
		const fetchListing = async() => {
			if (!params.listingId) return toast.error('ListingId is missing')

			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef)

			if(docSnap.exists()) {
				const data = docSnap.data() as ListingType;
				setListing(data)
				setLoading(false)
			}
		}
		
		fetchListing()
	}, [navigate, params.listingId])

	if(loading) return <Spinner />

	return (
		<main>
			{listing && listing.imgUrls && (
				<Swiper 
					style={{height: '250px'}}
					modules={[Navigation, Pagination, Scrollbar, A11y]}
					slidesPerView={1} 
					pagination={{clickable: true}}
				>
					{listing.imgUrls.map((url, index) => (
						<SwiperSlide key={index}>
							<div style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}} className="swiperSlideDiv"></div>
						</SwiperSlide>
					))}
				</Swiper>
			)}
			
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

			{listing && (
				<div className="listingDetails">
					<p className='listingName'>
						{listing.name} - ${listing.offer ? listing.discountedPrice : listing.regularPrice}
					</p>
					<p className="listingLocation">{listing.location}</p>
					<p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
					{listing.offer && (
						<p className="discountPrice">
							${+listing.regularPrice - +(listing.discountedPrice || 0)} discount
						</p>
					)}

					<ul className="listingDetailsList">
						<li>{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}</li>
						<li>{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}</li>
						<li>{listing.parking && 'Parking Spot'}</li>
						<li>{listing.furnished && 'Furnished'}</li>
					</ul>

					<p className="listingLocationTitle">Location</p>
					
					{listing.latitude && listing.longitude ? (
						<div className="leafletContainer">
							<MapContainer
								style={{height: '100%', width: '100%'}}
								center={[+listing.latitude, +listing.longitude]}
								//center={[51.505, -0.09]}
								zoom={13}
								scrollWheelZoom={false}
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								<Marker position={[+listing.latitude, +listing.longitude]}>
									<Popup>
										{listing.location}
									</Popup>
								</Marker>
							</MapContainer>
						</div>
					) : ''}

					{auth.currentUser?.uid !== listing.userRef && (
						<Link 
							to={`/contact/${listing.userRef}?listingName=${listing.name}`} 
							className='primaryButton'
						>
							Contact Landlord
						</Link>
					)}
				</div>
			)}
		</main>
	)
}