import { type } from "arktype";
import { type NextRequest, NextResponse } from "next/server";
import { BadRequest } from "@/lib/api-errors";
import * as files from "@/services/files";

const schema = type({
	"mime_type?": "string",
	size: "number",
});

export async function POST(request: NextRequest) {
	const body = await request.json();
	const result = schema(body);
	if (result instanceof type.errors) {
		return new BadRequest().setDebugCtx({ error: result.summary }).toNextResponse();
	}

	const { data, error } = await files.initiateUpload(result);
	if (error) {
		return error.toNextResponse();
	}

	return NextResponse.json(data);
}
