/**
 * Utility to compress uploaded image files to ultra-lightweight JPEG base64 Data URLs (10KB - 20KB)
 * to prevent browser localStorage QuotaExceededError while maintaining crisp avatar quality.
 */
export const compressImage = (file, maxWidth = 250, maxHeight = 250, quality = 0.6) => {
  return new Promise((resolve) => {
    if (!file) return resolve('');

    // If it's already a short URL (not base64 data url), return as is
    if (typeof file === 'string') {
      if (!file.startsWith('data:image')) return resolve(file);
    }

    const processImageSource = (src) => {
      const img = new Image();
      img.onerror = () => resolve(src);
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(src);

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = src;
    };

    if (typeof file === 'string') {
      processImageSource(file);
    } else {
      const reader = new FileReader();
      reader.onerror = () => resolve('');
      reader.onload = (event) => {
        processImageSource(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
};

/**
 * Safe localStorage setItem that automatically reclaims storage space if quota is exceeded
 */
export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`LocalStorage quota limit reached for key ${key}. Auto-clearing uncompressed legacy items...`);
    try {
      // Reclaim space by clearing legacy huge (>100KB) base64 strings
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) {
          const val = localStorage.getItem(k);
          if (val && val.length > 80000) {
            keysToRemove.push(k);
          }
        }
      }
      keysToRemove.forEach((k) => {
        if (k !== key) localStorage.removeItem(k);
      });

      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.warn('Silent fallback for localStorage setItem:', err);
      return false;
    }
  }
};
