import compression from "compression";

export const rules = compression({
  threshold: 5024, // Only compress responses over 1KB
  level: 6, // Compression level (1-9)
});
