export const ROLE_ROUTES: Record<string, string> = {
    'ADMIN': '/app/admin',
    'PENYEMAK': '/app/penyemak',
    'PENGESAH': '/app/pengesah',
    'PELULUS': '/app/pelulus',
};

export function getDefaultRoute(role: string): string {
    return ROLE_ROUTES[role] || '/app';
}
