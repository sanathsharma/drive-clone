export function camelCaseToCapitalWords(input: string): string {
	return (
		input
			// Insert a space before each uppercase letter (handles camelCase and PascalCase)
			.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
			// Handle sequences of uppercase letters followed by a lowercase (e.g. "XMLParser" -> "XML Parser")
			.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
			// Split into words, capitalize each
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ")
			.trim()
	);
}
