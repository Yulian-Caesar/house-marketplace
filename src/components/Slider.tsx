import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from "../firebase.config.ts";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ListingsType, ListingType } from "../types";
import { Spinner } from './Spinner';

export const Slider = () => {
	const [loading, setLoading] = useState(true)
	const [listings, setListings] = useState<ListingsType[]>([])

	const navigate = useNavigate();

	useEffect(() => {
		const fetchListings = async() => {
			const listingsRef = collection(db, 'listings')
			const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
			const querySnap = await getDocs(q)
			
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

		fetchListings()
	}, [])

	if(loading) return <Spinner />

	if(listings.length === 0) return <></>

	return listings && (
		<>
			<p className='exploreHeading'>Reccomended</p>

			<Swiper 
					style={{height: '200px'}}
					modules={[Navigation, Pagination, Scrollbar, A11y]}
					slidesPerView={1} 
					pagination={{clickable: true}}
				>
					{listings.map(({data, id}) => (
						<SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
							<div 
								className="swiperSlideDiv" 
								style={{background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover'}} 
							>
								<p className="swiperSlideText">{data.name}</p>
								<p className="swiperSlidePrice">
									${data.discountedPrice ?? data.regularPrice}
									{data.type === 'rent' && ' / month'}
								</p>
							</div>
						</SwiperSlide>
					))}
			</Swiper>
		</>
	)
}
