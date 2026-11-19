/**
 * API function to return the current server time.
 * Cloudflare Pages will automatically route requests from /api/time to this function.
 */
export async function onRequest({ request }) {
  const headers = {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Content-Type-Options': 'nosniff',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } });
  }

  const body = request.method === 'HEAD' ? null : JSON.stringify({ serverTime: Date.now() });
  return new Response(body, { headers });
}
