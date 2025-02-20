export function formatSecondsToMinutes(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}min ${remainingSeconds.toString().padStart(2, "0")}sec`;
}
