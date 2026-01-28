export interface User {
    _id: string;             
    login: string;
    firstname?: string;
    lastname?: string;
    name?: string;
    email: string;
    phone1?: string;
    phone2?: string;
    address?: string;
    isActive: boolean;
    sm: "m" | "g";            // enum frontend side
    userType: "admin" | "client"; // enum frontend side
    createdAt?: string;       // added by { timestamps: true }
    updatedAt?: string;       // added by { timestamps: true }
}

export interface PaginationParams { 
    page?: number; 
    limit?: number; 
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}