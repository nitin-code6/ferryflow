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
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                checkAuth,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;