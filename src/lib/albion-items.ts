export function getItemIconUrl(identifier: string, size = 80): string {
  const encoded = identifier.includes(" ")
    ? encodeURIComponent(identifier)
    : identifier;
  return `https://render.albiononline.com/v1/item/${encoded}.png?size=${size}&quality=2`;
}
