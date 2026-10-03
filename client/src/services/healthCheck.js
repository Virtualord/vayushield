export async function checkApiHealth(fetchImpl = globalThis.fetch) {
  try {
    const response = await fetchImpl('/api/health', { signal: AbortSignal.timeout(2500) });
    return response.ok;
  } catch {
    return false;
  }
}
