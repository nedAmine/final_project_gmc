import api from "./api";
import { type PaginationParams } from "../types/common";
import { type productSearchParam, type Product, type ProductListResponse } from "../types/product";

export const getProducts = (params?: PaginationParams) =>
  api.get<ProductListResponse>("/products", { params });

export const getProductsSearch = (params?: productSearchParam) =>
  api.get<ProductListResponse>("/products/search", { params });

export const getProductById = (id: string) =>
  api.get<Product>(`/products/${id}`);

export const createProduct = (data: FormData) =>
  api.post("/products", data);

export const updateProduct = (id: string, data: FormData) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`);