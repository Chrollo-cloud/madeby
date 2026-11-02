import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient, { authClient } from "../utils/apiClient";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const client = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        return (await apiClient.get("/user")).data.data;
      } catch (e) {
        if (e.response?.status === 401) return null;
        throw e;
      }
    },
    retry: false,
  });
  const login = async (credentials) => {
    await authClient.get("/sanctum/csrf-cookie");
    await authClient.post("/login", credentials);
    await client.invalidateQueries({ queryKey: ["auth"] });
    const data = await client.fetchQuery({ queryKey: ["auth"] });
    if (!data?.is_admin) {
      await logout();
      throw new Error("This account does not have admin access.");
    }
  };
  const logout = async () => {
    await authClient.post("/logout");
    client.setQueryData(["auth"], null);
  };
  return (
    <AuthContext.Provider
      value={{
        user: userQuery.data,
        loading: userQuery.isPending,
        error: userQuery.error,
        retry: userQuery.refetch,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
