export interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
	rating: number;
	image: string;
	description: string;
	isNew?: boolean;
	isOnSale?: boolean;
	discount?: number;
}

export interface TeamMember {
	id: string;
	name: string;
	role: string;
	image: string;
}

export type Category =
	| "All"
	| "Table"
	| "Dressers"
	| "Sofa"
	| "Chair"
	| "Bed"
	| "Lamps";
