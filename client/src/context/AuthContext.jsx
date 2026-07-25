import { getCurrentUser } from "../services/authService";

import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "admin" || user?.role === "staff";
    const isPassenger = user?.role === "citizen" || user?.role === "tourist";

    const checkAuth = async () => {
        try {
            const response = await getCurrentUser();
            setUser(response.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();

        const handleUnauthorizedLogout = () => {
            setUser(null);
            setLoading(false);
        };

        window.addEventListener("unauthorized-logout", handleUnauthorizedLogout);
        return () => {
            window.removeEventListener("unauthorized-logout", handleUnauthorizedLogout);
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                checkAuth,
                isAuthenticated,
                isAdmin,
                isPassenger
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;