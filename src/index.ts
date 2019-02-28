declare const fly: any;

fly.http.respondWith(async (req: any) => {
  return new Response('Redirecting', {
    headers: {
      'Location': 'https://fly.io/docs/apps/'
    },
    status: 302
  });
});