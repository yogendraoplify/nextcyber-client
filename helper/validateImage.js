const validateImage = async (file, rules) => {
  const { maxSizeMB, minWidth, minHeight, aspectRatio, formats } = rules;

  if (!formats.includes(file.type)) {
    return `Invalid file format. Allowed: ${formats
      .map((f) => f.split("/")[1].toUpperCase())
      .join(", ")}`;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return `File size must be ≤ ${maxSizeMB} MB`;
  }

  const img = new Image();
  const url = URL.createObjectURL(file);

  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });

  const { width, height } = img;
  URL.revokeObjectURL(url);

  if (width < minWidth || height < minHeight) {
    return `Minimum dimensions: ${minWidth} × ${minHeight}px`;
  }

  const actualRatio = width / height;
  const expectedRatio = aspectRatio;

  if (Math.abs(actualRatio - expectedRatio) > 0.05) {
    return `Invalid aspect ratio. Required ${aspectRatio.toFixed(2)}:1`;
  }

  return null;
};

export default validateImage;
