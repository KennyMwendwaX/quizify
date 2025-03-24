export function formatSecondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}min`;
  }

  return `${minutes}min ${remainingSeconds.toString().padStart(2, "0")}sec`;
}
