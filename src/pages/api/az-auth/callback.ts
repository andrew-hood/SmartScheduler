import axios from "axios";
import { env } from "../../../env.mjs";

export default async function handler(req: any, res: any) {
  const code = req.query.code;
  const tokenUrl = `${process.env.AZURE_AUTHORITY_URL}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", env.AZURE_APP_ID);
  params.append("scope", "Calendars.Read");
  params.append("code", code);
  params.append("redirect_uri", env.AZURE_APP_REDIRECT_URI);
  params.append("client_secret", env.AZURE_APP_SECRET);

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    res.redirect(`/?token=${response.data.access_token}`);
    return;
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.redirect("/");
    return;
  }
}
