import propertyGroups from "stylelint-config-recess-order/groups";

/** @type {import("stylelint").Config} */
const config = {
	extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
	ignoreFiles: ["dist/**", "node_modules/**", "build/**"],
	plugins: ["stylelint-order"],
	rules: {
		"order/properties-order": propertyGroups.map((group) => ({
			...group,
			// emptyLineBefore: "always",
			// noEmptyLineBetween: true,
		})),
		"selector-class-pattern": null,
		"selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global", "local"] }],
	},
};

export default config;
