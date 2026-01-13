import PropTypes from "prop-types";
import { createContext } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "../utils/axios";
import {
  // isValidToken,
  setSession
} from "../utils/jwt";

// ----------------------------------------------------------------------

const AuthContext = createContext({
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // **Menggunakan useQuery untuk inisialisasi user**
  const { data: user, isLoading } = useQuery(
    "authUser",
    async () => {
      const accessToken = localStorage.getItem("accessToken");

      // if (accessToken && isValidToken(accessToken)) {
      if (accessToken) {
        setSession(accessToken);
        const response = await axios.get("/auth/my-account");
        return response.data.user;
      }

      setSession(null);
      return null;
    },
    {
      staleTime: 60000, // Cache selama 1 menit sebelum refetch
      retry: false, // Jangan retry jika gagal
    }
  );

  // **Menggunakan useMutation untuk login**
  const loginMutation = useMutation(
    async ({ username, password }) => {
      const response = await axios.post("/auth/login", { username, password });
      const { accessToken, user } = response.data;
      setSession(accessToken);
      return user;
    },
    {
      onSuccess: (user) => {
        queryClient.setQueryData("authUser", user); // Update cache authUser
      },
    }
  );

  // **Menggunakan useMutation untuk logout**
  const logoutMutation = useMutation(
    async () => {
      setSession(null);
      return null;
    },
    {
      onSuccess: () => {
        queryClient.setQueryData("authUser", null); // Reset user cache
      },
    }
  );

  // **Menggunakan useMutation untuk register**
  const registerMutation = useMutation(
    async ({ email, password, firstName, lastName }) => {
      const response = await axios.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });
      const { accessToken, user } = response.data;
      setSession(accessToken);
      return user;
    },
    {
      onSuccess: (user) => {
        queryClient.setQueryData("authUser", user); // Update cache authUser
      },
    }
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isInitialized: !isLoading,
        user,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        register: registerMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

// PropType validation
AuthProvider.propTypes = {
  children: PropTypes.node,
};
