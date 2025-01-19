import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import app, { db } from "../firebase.config";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { ListingItem, ListingType } from "../components/ListingItem";

export const Category = () => {
	const [listings, setListings] = useState<ListingType[]>([])
	const [loading, setLoading] = useState(true)
	const { categoryName } = useParams();

	useEffect(() => {
		const fetchListings = async() => {
			try{
				// Get reference
				const listingsRef = collection(db, 'listings')

				// Create a query
				const q = query(
					listingsRef, 
					where('type', '==', categoryName), 
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
				<p>No listings for {categoryName}</p>
			)}
		</div>
	)
}
