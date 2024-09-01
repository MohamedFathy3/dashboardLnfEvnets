export function usePermissionCheck(permissions: string[]) {
    const user = useUserStore();
    if (user.user && user.user.superAdmin) {
        return true;
    }
    if (user.user && user.user.role && user.user.role.permissions.length > 0) {
        console.log(user.user.role.permissions);
        return permissions.some((permission) => user.user?.role.permissions.includes(permission));
    }
    return false;
}
