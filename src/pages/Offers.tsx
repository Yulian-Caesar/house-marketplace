import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { ListingItem, ListingType } from "../components/ListingItem";

export const Offers = () => {
	const [listings, setListings] = useState<ListingType[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchListings = async() => {
			try{
				// Get reference
				const listingsRef = collection(db, 'listings')

				// Create a query
				const q = query(
					listingsRef, 
					where('offer', '==', true), 
					orderBy('timestamp', 'desc'), 
					limit(10)
				)

				// Execute query
				const querySnap = await getDocs(q);

				const listingsArr: ListingType[] = [];

				querySnap.forEach((doc) => {
					return listingsArr.push({
						id: doc.id,
						data: doc.data()
					})
				})

				setListings(listingsArr)
				setLoading(false)
			} catch {
				toast.error('Could not fetch listening')
				setLoading(false)
			}
		}
		fetchListings()
	}, [])

	return (
		<div className="category">
			<header >
				<p className="pageHeader">Offers</p>
			</header>

			{loading ? (
				<Spinner /> 
			) : listings && listings.length ? (
				<>
					<main>
						<ul className="categoryListings">
							{listings.map((listing: ListingType) => (
								<ListingItem 
									key={listing.id} 
									listing={listing.data} 
									id={listing.id} 
								/>
							))}
						</ul>
					</main>
				</>
			) : (
				<p>There are no current offers</p>
			)}
		</div>
	)
}
