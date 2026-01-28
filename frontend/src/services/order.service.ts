import api from "./api";
import { 
  type Order, 
  type orderGuest, 
  type orderCreate, 
  type orderSearchParam, 
  type OrderListResponse 
} from "../types/order";

// admin only
export const getOrders = (params?: orderSearchParam) => //by filter
  api.get<OrderListResponse>("/orders", { params });
export const updateOrder = (id: string, data: Partial<Order>) =>
  api.put(`/orders/${id}`, data);
export const deleteOrder = (id: string) =>
  api.delete(`/orders/${id}`);

// only user
export const createOrder = (data: orderCreate) =>
  api.post("/orders", data);
export const getOrderById = (id: string) =>
  api.get<Order>(`/order/${id}`);
export const getOrdersByUser = (id: string) => 
  api.get<Order[]>(`/orders/userOrders/${id}`);

// all
export const createOrderGuest = (data: orderGuest) =>
  api.post("/orders/guest", data);
