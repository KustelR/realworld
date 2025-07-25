export function usernameToPath(username: string): string {
  return username.toLocaleLowerCase().replace(/ /g, "-");
}
