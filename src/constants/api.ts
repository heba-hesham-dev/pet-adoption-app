// Where the server lives.
// On Vercel (live demo) EXPO_PUBLIC_API_URL is set to the Render link.
// While testing on the iPhone, it falls back to the Mac's Wi-Fi address.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.33:3000';
