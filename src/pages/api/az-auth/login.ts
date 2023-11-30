import { env } from "../../../env.mjs";

export default function handler(req: any, res: any) {
  const url = `${env.AZURE_AUTHORITY_URL}/oauth2/v2.0/authorize?client_id=${
    env.AZURE_APP_ID
  }&response_type=code&redirect_uri=${encodeURIComponent(
    env.AZURE_APP_REDIRECT_URI
  )}&response_mode=query&scope=openid%20profile%20offline_access%20Calendars.Read`;

  res.redirect(url);
}