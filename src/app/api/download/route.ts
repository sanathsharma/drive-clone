import { Readable } from "node:stream";
import { type } from "arktype";
import { type NextRequest, NextResponse } from "next/server";
import { BadRequest } from "@/lib/api-errors";
import { attachmentDisposition } from "@/lib/content-disposition";
import * as downloads from "@/services/downloads";
import * as files from "@/services/files";

const schema = type({
	items: type({ id: "string", type: "'file'|'folder'" }).array(),
});

export async function POST(request: NextRequest) {
	const body = await request.json();
	const result = schema(body);
	if (result instanceof type.errors) {
		return new BadRequest().setDebugCtx({ error: result.summary }).toNextResponse();
	}

	const { items } = result;

	// A lone file has no zip-building to do - reuse the same presigned-redirect path as the
	// single-file download route.
	if (items.length === 1 && items[0].type === "file") {
		const { data: url, error } = await files.getDownloadUrl({ disposition: "attachment", id: items[0].id });
		if (error) {
			return error.toNextResponse();
		}
		return NextResponse.redirect(url, 302);
	}

	const { data, error } = await downloads.getSelectionZip(items);
	if (error) {
		return error.toNextResponse();
	}

	return new Response(Readable.toWeb(data.stream) as ReadableStream, {
		headers: {
			"Content-Disposition": attachmentDisposition(data.filename),
			"Content-Type": "application/zip",
		},
	});
}
