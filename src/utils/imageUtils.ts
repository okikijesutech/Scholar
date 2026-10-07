/**
 * Client-side Image Optimization Utility for Vision LLMs
 * Resizes phone snapshots down to ~1500px on the longest edge,
 * converts to standard JPEG, drastically reducing upload bandwidth,
 * avoiding LLM image size rejections, and cutting inference latency.
 */

export interface OptimizedImageData {
  base64: string;
  mimeType: 'image/jpeg';
  width: number;
  height: number;
  originalSizeBytes: number;
  optimizedSizeBytes: number;
}

export async function resizeImageForVision(
  file: File,
  maxLongEdge = 1500,
  quality = 0.85
): Promise<OptimizedImageData> {
  return new Promise((resolve, reject) => {
    // If not an image (e.g. PDF), reject with appropriate message
    if (!file.type.startsWith('image/')) {
      reject(new Error(`File "${file.name}" is not an image (${file.type}).`));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > maxLongEdge || height > maxLongEdge) {
        if (width >= height) {
          height = Math.round((height * maxLongEdge) / width);
          width = maxLongEdge;
        } else {
          width = Math.round((width * maxLongEdge) / height);
          height = maxLongEdge;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context for image processing.'));
        return;
      }

      // Draw with smooth bi-linear scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const base64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
      const approxSizeBytes = Math.round((base64.length * 3) / 4);

      resolve({
        base64,
        mimeType: 'image/jpeg',
        width,
        height,
        originalSizeBytes: file.size,
        optimizedSizeBytes: approxSizeBytes
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load and decode image "${file.name}".`));
    };

    img.src = objectUrl;
  });
}

/**
 * Converts a non-image file (e.g., application/pdf) directly to base64
 */
export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve({ base64, mimeType: file.type || 'application/octet-stream' });
    };
    reader.onerror = () => reject(new Error(`Failed to read file "${file.name}".`));
    reader.readAsDataURL(file);
  });
}
