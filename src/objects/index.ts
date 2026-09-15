import "server-only";

import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "@/constants";

const BUCKET = "assets";

const s3 = new S3Client({
	credentials: {
		accessKeyId: config.S3.ACCESS_KEY_ID,
		secretAccessKey: config.S3.SECRET_ACCESS_KEY,
	},
	endpoint: config.S3.ENDPOINT_URL,
	forcePathStyle: true,
	region: config.S3.REGION,
});

type GetUploadUrlParams = {
	contentLength: number;
	contentType?: string;
	expiresIn?: number;
};

/** Presigned `PUT` url for `key`. `contentLength` is bound into the signature, so S3 rejects an upload of a different size. */
export function getUploadUrl(key: string, { contentLength, contentType, expiresIn = 60 * 60 }: GetUploadUrlParams) {
	const command = new PutObjectCommand({
		Bucket: BUCKET,
		ContentLength: contentLength,
		ContentType: contentType,
		Key: key,
	});

	return getSignedUrl(s3, command, { expiresIn });
}

type GetDownloadUrlParams = {
	disposition?: "inline" | "attachment";
	filename?: string;
	expiresIn?: number;
};

/** Presigned `GET` url for `key`, meant to be consumed immediately (e.g. via redirect), not stored. */
export function getDownloadUrl(key: string, { disposition, filename, expiresIn = 60 }: GetDownloadUrlParams = {}) {
	const command = new GetObjectCommand({
		Bucket: BUCKET,
		Key: key,
		ResponseContentDisposition: disposition && `${disposition}${filename ? `; filename="${filename}"` : ""}`,
	});

	return getSignedUrl(s3, command, { expiresIn });
}

/** Returns the object's real size, or `undefined` if no object exists at `key`. */
export async function headObject(key: string) {
	try {
		const { ContentLength } = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
		return ContentLength === undefined ? undefined : { size: ContentLength };
	} catch (err) {
		if (err instanceof Error && err.name === "NotFound") {
			return undefined;
		}
		throw err;
	}
}

export async function deleteObject(key: string) {
	await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
