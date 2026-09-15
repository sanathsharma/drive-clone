import { describe, expect, it } from "vitest";
import { isFromDirectory } from "./upload";

function fileWithPath(path: string | undefined) {
	const file = new File(["content"], "name.txt");
	if (path !== undefined) {
		Object.defineProperty(file, "path", { value: path });
	}
	return file;
}

describe("isFromDirectory", () => {
	it("is false for a flat file whose path came from entry.fullPath (leading slash, one segment)", () => {
		expect(isFromDirectory(fileWithPath("/screenshot.png"))).toBe(false);
	});

	it("is false for a flat file whose path used file-selector's './name' fallback", () => {
		expect(isFromDirectory(fileWithPath("./screenshot-2026-09-15_15-13-15.png"))).toBe(false);
	});

	it("is true for a file nested one level inside a dropped folder", () => {
		expect(isFromDirectory(fileWithPath("/MyFolder/photo.png"))).toBe(true);
	});

	it("is true for a file nested several levels inside a dropped folder", () => {
		expect(isFromDirectory(fileWithPath("/MyFolder/sub/deep/photo.png"))).toBe(true);
	});

	it("is false when the file has no path at all", () => {
		expect(isFromDirectory(fileWithPath(undefined))).toBe(false);
	});
});
