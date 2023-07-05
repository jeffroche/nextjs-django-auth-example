interface Coffee {
	name: string;
	description: string;
	is_favorite: boolean;
}

interface Brand {
	id: number;
	name: string;
	is_favorite: boolean;
	coffees: Coffee[];
	image: string;
}

interface BrandsProps {
	data: Brand[];
}
