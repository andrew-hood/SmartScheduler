import { env } from "~/env.mjs";

export const GO1_AUTH_URL =
  env.NODE_ENV === "production"
    ? "https://auth.go1.com"
    : "https://auth.qa.go1.cloud";

export const GO1_API_V2_URL =
  env.NODE_ENV === "production"
    ? "https://api.go1.com/v2"
    : "https://public.qa.go1.cloud/v2";

export const GO1_API_V3_URL =
  env.NODE_ENV === "production"
    ? "https://gateway.go1.com"
    : "https://gateway.qa.go1.cloud";
