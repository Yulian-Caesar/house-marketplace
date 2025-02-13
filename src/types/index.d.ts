export type ListingType = {
	type: 'rent' | 'sale',
	imgUrls?: string[],
	name: string,
	location?: string,
	offer: boolean,
	discountedPrice?: string,
	regularPrice: string,
	bedrooms: number,
	bathrooms: number,
	id?: string,
	parking? : boolean,
	furnished? : boolean,
	latitude? : string,
	longitude? : string,
	userRef?: string,
	address?: string,
	images?: File[]
}

//export type ListingFormDataType = ListingType & {
//}

export type ListingsType = {
	id: string;
	data: ListingType;
}

export type UserType = {
	name?: string | null
	email?: string | null
}

export type SignUpFormDataType = {
	name: string,
	email: string,
	password?: string,
	timestamp?: FieldValue
}



export type ListingItemType = {
	listing: ListingType,
	id: string,
	onEdit?: (id: string) => void
	onDelete?: (id: string, name: string) => void
}

export type LandlordType = {
	email: string,
	name: string
}