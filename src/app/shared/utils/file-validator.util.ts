export class FileValidatorUtil {
  /**
   * Validates if a file exceeds the maximum allowed size in megabytes.
   * @param file The file to check
   * @param maxSizeMB Maximum size in MB
   * @returns true if file is within limits, false if it exceeds
   */
  static validateFileSize(file: File, maxSizeMB: number): boolean {
    if (!file) return false;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Validates if a file has an allowed MIME type.
   * @param file The file to check
   * @param allowedTypes Array of allowed MIME types (e.g. ['image/jpeg', 'image/png'])
   * @returns true if valid, false if invalid
   */
  static validateFileType(file: File, allowedTypes: string[]): boolean {
    if (!file) return false;
    return allowedTypes.includes(file.type);
  }
}
