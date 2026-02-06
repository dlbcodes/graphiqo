import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getChangedFields<T extends Record<string, any>>(
	original: T,
	updated: T
): Partial<T> {
	const changes: Partial<T> = {};

	for (const key in updated) {
		if (updated.hasOwnProperty(key)) {
			if (
				typeof updated[key] === "object" &&
				updated[key] !== null &&
				!Array.isArray(updated[key])
			) {
				const nestedChanges = getChangedFields(
					original[key],
					updated[key]
				);
				if (Object.keys(nestedChanges).length > 0) {
					changes[key] = nestedChanges as T[Extract<keyof T, string>];
				}
			} else if (original[key] !== updated[key]) {
				changes[key] = updated[key];
			}
		}
	}

	return changes;
}







