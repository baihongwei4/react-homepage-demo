import {logInStore} from "../reducers/store";
import {UserRole} from "../constants/LoginContants";

export function isAdmin() {
    return logInStore.getState().userRole === UserRole.ADMIN
}

export function getDashboardEntries() {
    const privilege = logInStore.getState().privilege
    if (privilege !== undefined && privilege.entries !== undefined) {
        return privilege.entries
    }
    return []
}