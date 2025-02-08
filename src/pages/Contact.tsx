import { useParams, useSearchParams } from "react-router";
import {db} from "../firebase.config";
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type LandlordType = {
	email: string,
	name: string
}

type ParamsType = {
	landlordId: string
}

export const Contact = () => {
	const [message, setMessage] = useState('')
	const [landlord, setLandlord] = useState<LandlordType | null>(null)
	const [searchParams, setSearchParams] = useSearchParams('')

	const params = useParams<ParamsType>();

	useEffect(() => {
		const getLandlord = async () => {
			if (!params.landlordId) return toast.error('LandlordId is missing')

			const docRef = doc(db, 'users', params.landlordId);
			const docSnap = await getDoc(docRef)

			if(docSnap.exists()) {
				const landlordData = docSnap.data() as LandlordType;
				setLandlord(landlordData)
			} else {
				toast.error('Could not get landlord data')
			}
		}

		getLandlord()

	}, [params.landlordId])

	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value);

	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Contact Landlord</p>
			</header>

			{landlord !== null && (
				<main>
					<div className="contactLandlord">
						<p className="landlordName">Contact: {landlord?.name}</p>
					</div>

					<form className="messageForm">
						<div className="messageDiv">
							<label htmlFor="message" className="messageLabel">Message</label>
							<textarea 
								name="message" 
								id="message" 
								className="textarea"
								value={message}
								onChange={onChange}
							>
							</textarea>
						</div>

						<a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
							<button type="button" className="primaryButton">Send Message</button>
						</a>

					</form>

				</main>
			)}

		</div>
	)
}
