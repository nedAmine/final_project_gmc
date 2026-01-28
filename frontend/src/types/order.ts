export interface OrderProduct {
    description: string;
    quantity: number;
    price: number;
}

export interface Order {
    user?: string; //objectId: [user._id]
    guestName?: string;
    products: OrderProduct[];
    totalPrice: number;
    deliveryCost: number;
    note: string;
    address: string;
    phone1: string;
    phone2?: string;
    status: "pending" | "processing" | "delivered" | "cancelled"; //enum
}

export interface orderGuest {
    guestName: string;
    products: OrderProduct[];
    address: string;
    phone1: string;
    phone2: string;
}

export interface orderCreate {
    user: string; //_id (objectId)
    products: OrderProduct[];
    address: string;
    phone1: string;
    phone2: string;
}

export interface orderSearchParam {
    status?: string; 
    user?: string; 
    page?: number; 
    limit?: number
}

export interface OrderListResponse {
    products: Order[];
    total: number;
    page: number;
    pages: number;
}