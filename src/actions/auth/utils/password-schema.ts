import { type } from "arktype";

const passwordSchema = type("8 <= string <= 32")
	.narrow((s, ctx) => {
		if (!/[a-z]/.test(s)) {
			return ctx.reject({ expected: "a lowercase letter", path: [] });
		}
		if (!/[A-Z]/.test(s)) {
			return ctx.reject({ expected: "an uppercase letter", path: [] });
		}
		if (!/[0-9]/.test(s)) {
			return ctx.reject({ expected: "a digit", path: [] });
		}
		if (!/[^A-Za-z0-9]/.test(s)) {
			return ctx.reject({ expected: "a special character", path: [] });
		}
		return true;
	})
	.configure({ actual: () => "<Redacted>" });

export default passwordSchema;
