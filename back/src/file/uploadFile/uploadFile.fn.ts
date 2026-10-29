import { type ActFn, ensureDir, ObjectId } from "@deps";
import { coreApp, file } from "../../../mod.ts";
import { type MyContext, throwError } from "@lib";

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
	image: ["png", "jpg", "jpeg", "webp", "gif", "avif"],
	video: ["mp4", "webm", "ogv", "mov"],
	doc: [
		"pdf",
		"doc",
		"docx",
		"xls",
		"xlsx",
		"ppt",
		"pptx",
		"csv",
		"txt",
		"zip",
	],
};

const MAX_SIZE_BYTES: Record<string, number> = {
	image: 15 * 1024 * 1024,
	video: 300 * 1024 * 1024,
	doc: 50 * 1024 * 1024,
};

const extensionOf = (name: string): string => {
	const dot = name.lastIndexOf(".");
	// `lastIndexOf` returns -1 when there is no extension, which would make
	// `slice(-1)` return the last character of the filename.
	return dot === -1 ? "" : name.slice(dot + 1).toLowerCase();
};

export const uploadFileFn: ActFn = async (body) => {
	const { user }: MyContext = coreApp.contextFns
		.getContextModel() as MyContext;

	const { formData, type, ...rest } = body.details.set;

	const fileToUpload: File = formData.get("file") as File;
	!fileToUpload && throwError("no file was sent");

	const allowed = ALLOWED_EXTENSIONS[type];
	!allowed && throwError("invalid file type");

	const extension = extensionOf(fileToUpload.name);
	if (!allowed.includes(extension)) {
		throwError(
			`unsupported file extension ".${extension}" for ${type}. Allowed: ${
				allowed.join(", ")
			}`,
		);
	}

	if (fileToUpload.size > MAX_SIZE_BYTES[type]) {
		throwError(
			`file is too large for ${type} (max ${
				Math.round(MAX_SIZE_BYTES[type] / (1024 * 1024))
			}MB)`,
		);
	}

	// The client controls the declared MIME type, so check it agrees with the
	// category the file is being stored under.
	if (type === "image" && !fileToUpload.type.startsWith("image/")) {
		throwError("declared content type is not an image");
	}
	if (type === "video" && !fileToUpload.type.startsWith("video/")) {
		throwError("declared content type is not a video");
	}

	const fileName = `${new ObjectId()}.${extension}`;

	const uploadDir = type === "image"
		? "./uploads/images"
		: type === "video"
		? "./uploads/videos"
		: "./uploads/docs";
	await ensureDir(uploadDir);
	await Deno.writeFile(`${uploadDir}/${fileName}`, fileToUpload.stream());

	return await file.insertOne({
		doc: {
			name: fileName,
			mimType: fileToUpload.type,
			size: fileToUpload.size,
			...rest,
		},
		relations: {
			uploader: {
				_ids: new ObjectId(user._id),
				relatedRelations: {
					uploadedAssets: true,
				},
			},
		},
		projection: body.details.get,
	});
};
