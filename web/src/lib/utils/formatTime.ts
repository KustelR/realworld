export default function formatTime(raw: string): string {
  const timestamp = new Date(raw);

  const showYear =
    timestamp.getFullYear() === new Date(Date.now()).getFullYear();

  return `${timestamp.toLocaleDateString(undefined, { month: "long", day: "numeric", year: showYear ? "numeric" : undefined })}`;
}
