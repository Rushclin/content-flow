"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/auth.service";
import { AuthContextType, User, LoginCredentials, RegisterCredentials } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const saveAuth = useCallback((authToken: string, authUser: User) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem(TOKEN_KEY, authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setToken(storedToken);
          setUser(parsedUser);

          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
          } catch (error) {
            clearAuth();
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'authentification:", error);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [clearAuth]);

  const login = async (credentials: LoginCredentials) => {
    const loadingToast = toast.loading("Connexion en cours...");
    try {
      const response = await authService.login(credentials);
      saveAuth(response.access_token, response.user);
      toast.success(`Bienvenue ${response.user.name} !`, { id: loadingToast });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error);
      const errorMessage = error.response?.data?.message || "Échec de la connexion. Veuillez vérifier vos identifiants.";
      toast.error(errorMessage, { id: loadingToast });
      throw new Error(errorMessage);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    const loadingToast = toast.loading("Création de votre compte...");
    try {
      const response = await authService.register(credentials);
      saveAuth(response.access_token, response.user);
      toast.success(`Compte créé avec succès ! Bienvenue ${response.user.name} !`, { id: loadingToast });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      const errorMessage = error.response?.data?.message || "Échec de l'inscription. Veuillez réessayer.";
      toast.error(errorMessage, { id: loadingToast });
      throw new Error(errorMessage);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      clearAuth();
      router.push("/auth/login");
    }
  }, [clearAuth, router]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
