import { type NextRequest, NextResponse } from "next/server";
import * as files from "@/services/files";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
	const { id } = await params;
	const disposition = request.nextUrl.searchParams.has("download") ? "attachment" : "inline";

	const { data: url, error } = await files.getDownloadUrl({ disposition, id });
	if (error) {
		return error.toNextResponse();
	}

	return NextResponse.redirect(url, 302);
}
