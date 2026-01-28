import api from "./api";

export interface Category {
  _id: string;
  name: string;
}

export const getCategories = () =>
  api.get<Category[]>("/categories");

export const createCategory = (name: string) => 
  api.post("/categories", name);

export const getCategoryById = (id: string) =>
  api.get<Category>(`/categories/${id}`);

export const updateategory = (id: string, name: string) =>
  api.put(`/categories/${id}`, name);

export const deleteCategory = (id: string) =>
  api.delete(`/categories/${id}`);