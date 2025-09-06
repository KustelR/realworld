export default async function getErrorMessages(
  response: Response,
): Promise<string[]> {
  const data = await response.json();
  const errors = (data.detail as string).replaceAll(`'`, `"`);

  return JSON.parse(errors);
}
