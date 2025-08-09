export const isValidImageExtension = (filename: string): boolean => {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
};

export const isValidPdfExtension = (filename: string): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return extension === '.pdf';
};

export const isValidGeoJsonExtension = (filename: string): boolean => {
  const validExtensions = ['.geojson', '.json'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
};

export const isValidVideoExtension = (filename: string): boolean => {
  const validExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
};

export const isValidDocumentExtension = (filename: string): boolean => {
  const validExtensions = ['.doc', '.docx', '.txt', '.rtf', '.odt'];
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return validExtensions.includes(extension);
};

export const getFileExtension = (filename: string): string => {
  return filename.substring(filename.lastIndexOf('.'));
};

export const getFileNameWithoutExtension = (filename: string): string => {
  return filename.substring(0, filename.lastIndexOf('.'));
};

export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateFile = (
  file: File,
  allowedExtensions: string[],
  maxSizeInMB: number
): { isValid: boolean; error?: string } => {
  const extension = getFileExtension(file.name).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`
    };
  }

  if (!validateFileSize(file, maxSizeInMB)) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSizeInMB}MB limit`
    };
  }

  return { isValid: true };
};
