import DeleteIcon from "../assets/svg/deleteIcon.svg?react";
import EditIcon from "../assets/svg/editIcon.svg?react";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";
import { Link } from "react-router";
import { Spinner } from "./Spinner";
import { ListingItemType } from "../types";


export const ListingItem = ({ listing, id, onEdit, onDelete}: ListingItemType) => {
	return listing ? (
		<li className="categoryListing">
			<Link to={`/category/${listing.type}/${id}`} className="categoryListingLink">
				<img src={listing.imgUrls && listing.imgUrls[0]} 
					alt={listing.name} 
					className="categoryListingImg" 
				/>
				<div className="categoryListingDetails">
					<p className="categoryListingLocation">{listing.location}</p>
					<p className="categoryListingName">{listing.name}</p>
					<p className="categoryListingPrice">
						${listing.offer ? listing.discountedPrice : listing.regularPrice}
						{listing.type === 'rent' && '/ Month'}
					</p>
					<div className="categoryListingInfoDiv">
						<img src={bedIcon} alt="bed" />
						<p className="categoryListingInfoText">
							{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
						</p>

						<img src={bathtubIcon} alt="bathtub" />
						<p className="categoryListingInfoText">
							{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 bathroom'}
						</p>
					</div>
				</div>
			</Link>
			{onDelete && (
				<DeleteIcon 
					fill="rgb(231, 76, 60)" 
					className="removeIcon"
					onClick={() => onDelete(id, listing.name)}
				/>
			)}

			{onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
		</li>
	) : <Spinner />
}
