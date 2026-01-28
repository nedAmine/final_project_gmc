import api from "./api";
import { 
  type registerUser,
  type LoginPL,
  type editPasswordPL
} from "../types/auth";
import { type User } from "../types/common";

export const registerRequest = (email: string) =>
  api.post("/auth/register/request", { email });

export const registerConfirm = (data: registerUser) =>
  api.post("/auth/register/confirm", data);

export const login = (data: LoginPL) =>
  api.post("/auth/continue/manual", data);

export const loginWithGoogle = (token: string) =>
  api.post("/auth/continue/google", { token });

export const getProfile = () =>
  api.get<User>("/auth/me");

export const updateData = (data: Partial<registerUser>) =>
  api.put("/auth/me", data);

export const editPassword = (data: editPasswordPL) =>
  api.put("/auth/me/password", data);