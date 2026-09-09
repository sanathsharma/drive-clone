import type { ArkError, ArkErrors } from "arktype";
import logger from "./logger";
import { camelCaseToCapitalWords } from "./string";

export function toErrorsMap(errors: Record<string, { message: string }[]>) {
	const map = new Map<string, { message: string }[]>();
	for (const key in errors) {
		map.set(key, errors[key]);
	}
	return map;
}

type Translator = Awaited<ReturnType<typeof import("next-intl/server").getTranslations>>;

const getValues = (err: ArkError): Record<string, string | number> => {
	if (err.path.length === 0) {
		return {};
	}
	return {
		actual: err.actual,
		expected: err.expected,
		path: camelCaseToCapitalWords(err.path.at(-1) as string),
		...("min" in err && { min: err.min as number }),
		...("max" in err && { max: err.max as number }),
		...("maxLength" in err && { maxLength: err.maxLength as number }),
		...("minLength" in err && { minLength: err.minLength as number }),
		...("exactLength" in err && { exactLength: err.exactLength as number }),
	};
};

export function toFieldErrors(errors: ArkErrors, t: Translator) {
	const fieldErrors: Record<string, { message: string }[]> = {};

	for (const err of errors) {
		const field = err.path.join(".") || "_form";
		const key = `errors.${field}.${err.code}`;
		const defaultKey = `errors.${field}.default`;
		const values = getValues(err);
		const message = (() => {
			if (t.has(key)) {
				return t(key, values);
			}
			logger.warn(`[toFieldErrors] No translation for ${key}`);
			if (t.has(defaultKey)) {
				return t(defaultKey, values);
			}
			logger.error(`[toFieldErrors] No default translation for ${key}`);
			return key;
		})();

		if (!fieldErrors[field]) {
			fieldErrors[field] = [];
		}
		fieldErrors[field].push({ message });
	}

	logger.debug("[toFieldErrors] fieldErrors", fieldErrors);

	return fieldErrors;
}
