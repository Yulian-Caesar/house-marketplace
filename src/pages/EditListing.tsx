import { getAuth, onAuthStateChanged } from "firebase/auth";
import { serverTimestamp, getDoc, updateDoc, doc  } from "firebase/firestore";
//import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "firebase/storage";
import { app, db } from "../firebase.config.ts";
import { useNavigate, useParams } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "../components/Spinner";
import { toast } from "react-toastify";
import { ListingType } from "../components/ListingItem";

export const EditListing = () => {
	const [geolocationEnabled, setGeolocationEnabled] = useState(false);
	const [loading, setLoading] = useState(false)
	const [listing, setListing] = useState<ListingType | null>(null)
	const [formData, setFormData] = useState({
		type: 'rent',
		name: '',
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: '',
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: '0',
		longitude: '0'
	})
	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData

	const auth = getAuth(app);
	const navigate = useNavigate();
	const params = useParams();
	const isMounted = useRef(true);

	// redirect if listing is not user's
	useEffect(() => {
		if(listing && listing.userRef !== auth.currentUser?.uid) {
			toast.error('You can not edit that listing')
			navigate('/')
		}
	}, [listing, navigate, auth.currentUser?.uid])

	// fetch listing to edit
	useEffect(() => {
		setLoading(true)

		const fetchListing = async() => {
			if(!params.listingId) return toast.error('Listing id not found')

			const docRef = doc(db, 'listings', params.listingId);
			const docSnap = await getDoc(docRef)
			if(docSnap.exists()) {
				const data = docSnap.data() as ListingType
				setListing(data)
				setFormData({...data, address: data.location})
				setLoading(false)
			} else {
				navigate('/')
				toast.error('Listing does not exist')
			}
		}
		fetchListing()
	}, [navigate, params.listingId])


	// Sets userRef to logged in user
	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					setFormData({ ...formData, userRef: user.uid })
				} else {
					navigate('/sign-in')
				}
			})
		}

		return () => {
			isMounted.current = false;
		}
	}, [isMounted])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true)

		if (+discountedPrice >= +regularPrice) {
			setLoading(false)
			return toast.error('Discounted price needs to be less that regular price')
		}

		if (images.length > 6) {
			setLoading(false)
			return toast.error('Max 6 images')
		}

		let geolocation = {};
		let location;

		if (geolocationEnabled) {
			// add geolocation here by google or something
		} else {
			geolocation.lat = latitude;
			geolocation.lng = longitude;
		}

		const formDataCopy = {
			...formData,
			//imgUrls,
			geolocation,
			timestamp: serverTimestamp()
		}

		// Store image in firebase
		//const storeImage = async (image) => {
		//	return new Promise((resolve, reject) => {
		//		const storage = getStorage();
		//		const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

		//		const storageRef = ref(storage, 'images/' + fileName);
		//		const uploadTask = uploadBytesResumable(storageRef, image);

		//		uploadTask.on('state_changed', 
		//			(snapshot) => {
		//			  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		//			  console.log('Upload is ' + progress + '% done');
		//			  switch (snapshot.state) {
		//				case 'paused':
		//				  console.log('Upload is paused');
		//				  break;
		//				case 'running':
		//				  console.log('Upload is running');
		//				  break;
		//			  }
		//			}, 
		//			(error) => {
		//				reject(error)
		//			}, 
		//			() => {
		//			  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
		//				resolve(downloadURL);
		//			  });
		//			}
		//		  );
		//	})
		//}

		//const imgUrls = await Promise.all(
		//	[...images].map(image => storeImage(image))
		//).catch(() => {
		//	setLoading(false)
		//	 toast.error('Images not uploaded');
		//	 return
		//})

		//console.log(imgUrls)

		formDataCopy.location = address;
		delete formDataCopy.images;
		delete formDataCopy.address;
		!formDataCopy.offer && delete formDataCopy.discountedPrice;

		// update listing
		const docRef = doc(db, 'listings', params.listingId)
		await updateDoc(docRef, formDataCopy)
		setLoading(false)
		toast.success('Listing saved')
		navigate(`/category/${formDataCopy.type}/${docRef.id}`)
	}

	const onMutate = (e: any) => {
		let boolean = null;

		if (e.target.value === 'true') {
			boolean = true;
		}
		if (e.target.value === 'false') {
			boolean = false;
		}

		// Files
		if (e.target.files) {
			setFormData(prevState => ({
				...prevState,
				images: e.target.files
			}))
		}

		// Text/Boolean/Numbers
		if (!e.target.files) {
			setFormData(prevState => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value
			}))
		}
	}

	if (loading) {
		return <Spinner />
	}

	return (
		<div className="profile">
			<header>
				<p className="pageHeader">Edit Listing</p>
			</header>

			<main>
				<form onSubmit={onSubmit}>
					<label className="formLabel">Sell / Rent</label>
					<div className="formButtons">
						<button
							type='button'
							className={type === 'sale' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='sale'
							onClick={onMutate}
						>
							Sell
						</button>
						<button
							type='button'
							className={type === 'rent' ? 'formButtonActive' : 'formButton'}
							id='type'
							value='rent'
							onClick={onMutate}
						>
							Rent
						</button>
					</div>

					<label className='formLabel'>Name</label>
					<input
						className='formInputName'
						type='text'
						id='name'
						value={name}
						onChange={onMutate}
						maxLength={32}
						minLength={10}
						required
					/>

					<div className='formRooms flex'>
						<div>
							<label className='formLabel'>Bedrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bedrooms'
								value={bedrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>
						</div>
						<div>
							<label className='formLabel'>Bathrooms</label>
							<input
								className='formInputSmall'
								type='number'
								id='bathrooms'
								value={bathrooms}
								onChange={onMutate}
								min='1'
								max='50'
								required
							/>
						</div>
					</div>

					<label className='formLabel'>Parking spot</label>
					<div className='formButtons'>
						<button
							className={parking ? 'formButtonActive' : 'formButton'}
							type='button'
							id='parking'
							value='true'
							onClick={onMutate}
						//min='1'
						//max='50'
						>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='parking'
							value='false'
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label className='formLabel'>Furnished</label>
					<div className='formButtons'>
						<button
							className={furnished ? 'formButtonActive' : 'formButton'}
							type='button'
							id='furnished'
							value='true'
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? 'formButtonActive'
									: 'formButton'
							}
							type='button'
							id='furnished'
							value='false'
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label className='formLabel'>Address</label>
					<textarea
						className='formInputAddress'
						//type='text'
						id='address'
						value={address}
						onChange={onMutate}
						required
					/>
					{!geolocationEnabled && (
						<div className='formLatLng flex'>
							<div>
								<label className='formLabel'>Latitude</label>
								<input
									className='formInputSmall'
									type='number'
									id='latitude'
									value={latitude}
									onChange={onMutate}
									required
								/>
							</div>
							<div>
								<label className='formLabel'>Longitude</label>
								<input
									className='formInputSmall'
									type='number'
									id='longitude'
									value={longitude}
									onChange={onMutate}
									required
								/>
							</div>
						</div>
					)}


					<label className='formLabel'>Offer</label>
					<div className='formButtons'>
						<button
							className={offer ? 'formButtonActive' : 'formButton'}
							type='button'
							id='offer'
							value='true'
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null ? 'formButtonActive' : 'formButton'
							}
							type='button'
							id='offer'
							value='false'
							onClick={onMutate}
						>
							No
						</button>
					</div>

					<label className='formLabel'>Regular Price</label>
					<div className='formPriceDiv'>
						<input
							className='formInputSmall'
							type='number'
							id='regularPrice'
							value={regularPrice}
							onChange={onMutate}
							min='50'
							max='750000000'
							required
						/>
						{type === 'rent' && <p className='formPriceText'>$ / Month</p>}
					</div>
					{offer && (
						<>
							<label className='formLabel'>Discounted Price</label>
							<input
								className='formInputSmall'
								type='number'
								id='discountedPrice'
								value={discountedPrice}
								onChange={onMutate}
								min='50'
								max='750000000'
								required={offer}
							/>
						</>
					)}

					<label className='formLabel'>Images</label>
					<p className='imagesInfo'>
						The first image will be the cover (max 6).
					</p>
					<input
						className='formInputFile'
						type='file'
						id='images'
						onChange={onMutate}
						max='6'
						accept='.jpg,.png,.jpeg'
						multiple
						required
					/>
					<button type='submit' className='primaryButton createListingButton'>
						Edit Listing
					</button>

				</form>
			</main>
		</div>
	)
}
