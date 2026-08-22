/** Safe JSON parsing for visualizer API responses (handles 413 plain-text errors). */

export async function readVisualizerResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  if (!text) {
    throw new Error(res.ok ? "Empty response from server" : `Request failed (${res.status})`);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    if (res.status === 413 || /entity too large|payload too large/i.test(text)) {
      throw new Error(
        "Photo is too large to upload. Please try a smaller image or retake your selfie — we'll compress it automatically on retry."
      );
    }
    const preview = text.slice(0, 120).replace(/\s+/g, " ").trim();
    throw new Error(
      res.ok
        ? "Unexpected response from server"
        : preview || `Request failed (${res.status})`
    );
  }
}
