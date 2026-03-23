// src/auth/permissions.js
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  DELIVERY: 'DELIVERY',
  EDITOR: 'EDITOR',
}

// Single source of truth for nav items and access
export const NAV_PERMISSIONS = [
  { label: 'Dashboard',     path: '/admin',               roles: [ROLES.ADMIN, ROLES.EDITOR, ROLES.DELIVERY] },
  { label: 'Categories',    path: '/admin/categories',    roles: [ROLES.ADMIN, ROLES.EDITOR] },
  { label: 'Products',      path: '/admin/products',      roles: [ROLES.ADMIN, ROLES.EDITOR] },
  { label: 'Ads',           path: '/admin/ads',           roles: [ROLES.ADMIN, ROLES.EDITOR] },
  { label: 'Offers',        path: '/admin/offers',        roles: [ROLES.ADMIN, ROLES.EDITOR] },
  { label: 'Announcements', path: '/admin/announcements', roles: [ROLES.ADMIN, ROLES.EDITOR] },
  { label: 'Rules',         path: '/admin/rules',         roles: [ROLES.ADMIN] },
  { label: 'Orders',        path: '/admin/orders',        roles: [ROLES.ADMIN] },
  { label: 'Users',         path: '/admin/users',         roles: [ROLES.ADMIN] },
  { label: 'Delivery',      path: '/delivery',            roles: [ROLES.DELIVERY, ROLES.ADMIN] },
  { label: 'Inventory',     path: '/admin/inventory',    roles: [ROLES.ADMIN] },
]

export function canAccess(role, path) {
  const cleanPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  const item = NAV_PERMISSIONS.find(i => i.path === cleanPath)
  if (!item) return false
  return item.roles.includes(role)
}

export function itemsForRole(role) {
  return NAV_PERMISSIONS.filter(i => i.roles.includes(role))
}
