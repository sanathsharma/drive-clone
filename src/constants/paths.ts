export const paths = {
	auth: {
		requestPasswordReset: (params: Record<string, string> = {}) => {
			let url = "/auth/request-password-reset";
			if (Object.keys(params).length) {
				const searchParams = new URLSearchParams();
				for (const [key, value] of Object.entries(params)) {
					searchParams.set(key, value);
				}
				url += `?${searchParams.toString()}`;
			}
			return url.toString();
		},
		resetPassword: () => "/auth/reset-password",
		signIn: (message?: string) => {
			let url = "/auth/sign-in";
			if (message) {
				url += `?message=${encodeURIComponent(message)}`;
			}
			return url.toString();
		},
		signUp: () => "/auth/sign-up",
	},
	categories: () => "/categories",
	dashboard: () => "/",
	products: () => "/products",

	reports: {
		monthly: () => "/reports/monthly",
		today: () => "/reports",
		weekly: () => "/reports/weekly",
	},
	sales: () => "/sales",
};
