export const truncate = (text: string, max: number): string =>
  text.length > max ? text.substring(0, max).trim() + "..." : text;

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
