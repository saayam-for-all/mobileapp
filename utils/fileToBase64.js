import * as FileSystem from 'expo-file-system';

/**
 * Accepted MIME types for profile photo (jpeg/jpg and png only).
 */
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

/**
 * Converts a File to a Base64 data URL string using FileReader (readAsDataURL).
 * Returned string includes the prefix "data:<mime>;base64,..." as required by the API.
 *
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Resolves with the full data URL (e.g. "data:image/jpeg;base64,/9j/4AAQ...")
 * @throws {Error} - If file type is not image/jpeg or image/png
 */
export async function fileToBase64(file) {
  if (!file?.uri) {
    throw new Error("Invalid file");
  }

  const type = (file.type || "").toLowerCase();
  if (!ACCEPTED_IMAGE_TYPES.includes(type)) {
    throw new Error("Only JPG and PNG formats are accepted.");
  }

  const base64 = await FileSystem.readAsStringAsync(file.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:${type};base64,${base64}`;
}
