const routes = [
	'/account/preferences',
	'/articles/archive',
	'/billing/invoices',
	'/catalog/featured',
	'/checkout/summary',
	'/comments/recent',
	'/dashboard/activity',
	'/events/upcoming',
	'/files/shared',
	'/health/details',
	'/integrations/status',
	'/messages/unread',
	'/notifications/history',
	'/orders/tracking',
	'/products/recommended',
	'/reports/monthly',
	'/search/suggestions',
	'/sessions/active',
	'/teams/members',
	'/users/profile',
	'/users/:id/profile',
	'/users/:id/settings',
	'/users/:id/notifications',
	'/users/:id/messages',
	'/users/:id/messages/:messageId',
	'/users/:id/messages/:messageId/replies',
	'/users/:id/messages/:messageId/attachments',
	'/users/:id/messages/:messageId/attachments/:attachmentId'
]

export const extraRoutes = [
	...routes,
	...routes.map((route) => `/:locale${route}`),
	...routes.map((route) => `/v2${route}`),
	...routes.map((route) => `/v2/:locale${route}`)
]

const staticRoutes = new Set(extraRoutes.filter((route) => !route.includes(':')))
const dynamicRoutes = extraRoutes
	.filter((route) => route.includes(':'))
	.map((route) => new RegExp(`^${route.replace(/:[^/]+/g, '[^/]+')}$`))

export const matchesExtraRoute = (path) =>
	staticRoutes.has(path) || dynamicRoutes.some((route) => route.test(path))

export const matchesExtraPostRoute = (path) =>
	path.endsWith('/submit') && matchesExtraRoute(path.slice(0, -7))
