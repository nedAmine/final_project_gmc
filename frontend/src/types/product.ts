export interface productSearchParam {
    category: string; 
    minPrice: number;
    maxPrice: number, 
    searchText: string, 
    page: number,
    limit: number
}

export interface Variant {
    code: string;
    price: number;
    oldPrice?: number;
    available: boolean;
    untaxedPrice?: number;
    promo?: number;
}

export interface Product {
    _id: string; 
    name: string;
    slug: string;
    description?: string;
    available: boolean;
    photos: { url: string }[];
    categories: string[]; // ObjectId[] <=>> string[] frontend side
    defaultPrice: number;
    oldDefaultPrice?: number;
    tax: number;
    untaxedPrice?: number;
    promo?: number;
    variants: Variant[];
    createdAt?: string; // added by { timestamps: true }
    updatedAt?: string; // added by { timestamps: true }
}

export interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    pages: number;
}