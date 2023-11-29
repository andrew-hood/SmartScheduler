export { default } from "next-auth/middleware";

// add your pages here that you want to protect from unauthenticated users
// see https://next-auth.js.org/configuration/nextjs#middleware
export const config = { matcher: ["/examples/:path*"] };
