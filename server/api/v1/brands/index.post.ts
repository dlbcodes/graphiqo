import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	// 1. Authenticate the user
	const user = await requireAuthUser(event);

	// 2. Parse the body
	const body = await readBody(event);

	// 3. Create the brand profile with the new schema structure
	return await prisma.brandProfile.create({
		data: {
			name: body.name,
			// palette is now an array of hex strings
			palette: body.palette || [
				"#4f39f6",
				"#10b981",
				"#f59e0b",
				"#ef4444",
				"#8b5cf6",
				"#06b6d4",
				"#ec4899",
			],
			// Updated from secondaryColor to textColor
			textColor: body.textColor || "#374151",
			fontFamily: body.fontFamily || "Inter",
			logoUrl: body.logoUrl,
			profileId: user.id,
		},
	});
});