/**
 * Converts a Blob to a Base64 data URL string using FileReader (readAsDataURL).
 * Returned string includes the prefix "data:<mime>;base64,...".
 *
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Resolves with the full data URL (e.g. "data:image/jpeg;base64,/9j/4AAQ...")
 * @throws {Error} - If file type is not image/jpeg or image/png
 */

export const blobToBase64 = (blob) => {
  if (!blob || !(blob instanceof Blob)) {
    throw new Error("Invalid blob");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to convert blob to base64"));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("FileReader error"));
    reader.readAsDataURL(blob);
  });
};