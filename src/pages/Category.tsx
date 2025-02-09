import { collection, getDocs, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { ListingItem, ListingType } from "../components/ListingItem";
import { ListingsType } from "../components/Slider";

export const Category = () => {
	const [listings, setListings] = useState<ListingsType[]>([])
	const [loading, setLoading] = useState(true)
	const [lastFetchedListing, setLastFetchedListing] = useState<QueryDocumentSnapshot | null>(null)
	const { categoryName } = useParams();

	// Pagination / Load more
	const onFetchMoreListings = useCallback(async() => {
		console.log('create function')
		try{
			// Get reference
			const listingsRef = collection(db, 'listings')

			// Create a query
			const q = query(
				listingsRef, 
				where('type', '==', categoryName), 
				orderBy('timestamp', 'desc'),
				...(lastFetchedListing ? [startAfter(lastFetchedListing)] : []),
				limit(1)
			)

			// Execute query
			const querySnap = await getDocs(q);
			const lastVisible = querySnap.docs[querySnap.docs.length - 1];
			setLastFetchedListing(lastVisible)

			const newListings: ListingsType[] = [];

			querySnap.forEach((doc) => {
				return newListings.push({
					id: doc.id,
					data: doc.data() as ListingType
				})
			})

			setListings(prevState => [...prevState, ...newListings])
			setLoading(false)

			//if (querySnap.docs.length < 10) { 
			//	setLastFetchedListing(null); // Hide "Load More"
			//}

		} catch {
			toast.error('Could not fetch listening')
			setLoading(false)
		}
	}, [categoryName, lastFetchedListing])

	useEffect(() => {
		
		onFetchMoreListings()
	}, [categoryName])

	

	return (
		<div className="category">
			<header className="pageHeader">
				{categoryName === 'rent' 
					? 'Places for rent' 
					: 'Places for sale'
				}
			</header>

			{loading ? (
				<Spinner /> 
			) : listings && listings.length ? (
				<>
					<main>
						<ul className="categoryListings">
							{listings.map((listing) => (
								<ListingItem 
									key={listing.id} 
									listing={listing.data} 
									id={listing.id} 
								/>
							))}
						</ul>
					</main>

					<br />
					<br />
					{lastFetchedListing && (
						<p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
					)}
				</>
			) : (
				<p>No listings for {categoryName}</p>
			)}
		</div>
	)
}
