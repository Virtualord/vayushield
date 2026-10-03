export async function copyToClipboard(text, clipboard = globalThis.navigator?.clipboard) {
  if (!clipboard?.writeText) throw new Error('Clipboard is unavailable');
  await clipboard.writeText(text);
}
