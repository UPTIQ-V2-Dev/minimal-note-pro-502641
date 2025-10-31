import { Role } from '../generated/prisma/index.js';

const allRoles = {
    [Role.USER]: ['manageNotes'],
    [Role.ADMIN]: ['getUsers', 'manageUsers', 'manageNotes']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
