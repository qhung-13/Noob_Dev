import { apiClient } from "../../lib/api/client";

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      role: "CUSTOMER" | "ADMIN";
    };
    accessToken: string;
  };
}

export async function loginApi(email: string, password: string) {
  const response = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return response.data.data;
}

export async function registerApi(
  email: string,
  password: string,
  name: string,
) {
  const response = await apiClient.post<AuthResponse>("/auth/register", {
    email,
    password,
    name,
  });

  return response.data.data;
}
