export function isValidURL(string) {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9.-]+)(:[0-9]+)?(\/[^\s]*)?$/;
  return regex.test(string);
}