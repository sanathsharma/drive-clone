/**
 * `Content-Disposition: attachment` header value for `filename`, safe against header injection
 * (stripped CR/LF/quotes) and non-ASCII names (a UTF-8 extended value alongside an ASCII fallback).
 */
export function attachmentDisposition(filename: string): string {
	const ascii = filename.replace(/[\r\n"]/g, "").replace(/[^\x20-\x7E]/g, "_");
	const encoded = encodeURIComponent(filename);
	return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}
