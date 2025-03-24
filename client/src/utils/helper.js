import { useSelector } from "react-redux";
import { findOne } from "services/user";
import { useState, useEffect, useMemo } from "react";
// export const useHasRole = (role) => {
//   const roles = useSelector((state) => state.user?.roles);
//   console.log("roles", roles);
//   const findRole = roles?.includes(role);
//   return findRole;
// };

export const useHasRole = (roleName) => {
  const [hasRole, setHasRole] = useState(false);
  const userId = useSelector((state) => state.user.data?.id);
  // console.log("userId", userId);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await findOne(userId);
        // console.log("response", user);

        const roles = user?.data?.roles || [];
        // console.log("roles", roles);

        const roleExists = roles.some((role) => role.name === roleName);
        setHasRole(roleExists);
      } catch (error) {
        console.error("Error fetching user role:", error);
        setHasRole(false);
      }
    };

    if (userId) {
      fetchUserRole();
    }
  }, [userId, roleName]);

  return hasRole;
};

// export const useHasPermission = (permission) => {
//   const permissions = useSelector((state) => state.user?.permissions);
//   const findPermission = permissions?.includes(permission);
//   return findPermission;
// };

export const useHasPermission = (permissionName) => {
  const [permissions, setPermissions] = useState([]);
  const userId = useSelector((state) => state.user.data?.id);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      if (!userId) return;

      try {
        const user = await findOne(userId);
        const userPermissions = user?.data?.roles?.[0]?.permissions || [];
        setPermissions(userPermissions);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        setPermissions([]); 
      }
    };

    fetchUserPermissions(); 
  }, [userId]);

 
  const hasPermission = useMemo(() => {
    if (!permissionName) return true; 
    return permissions.some((permission) => permission.name === permissionName);
  }, [permissions, permissionName]);

  return permissionName ? hasPermission : permissions;
};
