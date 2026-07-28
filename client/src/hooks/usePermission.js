import { useAuth } from '../context/AuthContext';
import { rolePermissions } from '../config/permissions';

export const usePermission = () => {
    const { user } = useAuth();
    
    // Default to false if user or role is not available
    const role = user?.role;

    const can = (permissionName) => {
        if (!role || !rolePermissions[role]) {
            return false;
        }
        return !!rolePermissions[role][permissionName];
    };

    return { can, role };
};
