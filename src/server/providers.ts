import axios from "axios";
import { Provider } from "next-auth/providers";
import { env } from "~/env.mjs";
import { GO1_AUTH_URL, GO1_API_V2_URL } from "~/utils/urls";

/**
 * This is an example of a custom provider that uses the OAuth flow. This is useful if you want to
 * use Go1's official login to authenticate users.
 */
export const Go1AuthorizationFlow = {
  id: "go1",
  name: "GO1 OAuth",
  type: "oauth",
  authorization: {
    url: `${GO1_AUTH_URL}/oauth/authorize`,
    params: { scope: env.GO1_CLIENT_SCOPES },
  },
  token: `${GO1_AUTH_URL}/oauth/token`,
  userinfo: {
    url: `${GO1_API_V2_URL}/me`,
    async request({ client, tokens }) {
      const profile = await client.userinfo(tokens.access_token!);
      return { ...profile, access_token: tokens.access_token };
    },
  },
  profile: (profile) => {
    return {
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`,
      email: profile.email,
      image: "",
      access_token: profile.access_token,
    };
  },
  clientId: env.GO1_CLIENT_ID,
  clientSecret: env.GO1_CLIENT_SECRET,
} as Provider;

/**
 * This is an example of a custom provider that uses the credentials flow. This is useful if you
 * want to use a custom login form instead of the default OAuth flow.
 */
export const GO1CredentialsFlow = {
  id: "go1-credentials",
  name: "GO1 Credentials",
  type: "credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  authorize: async (credentials) => {
    const payload = {
      ...credentials,
      grant_type: "password",
      client_id: env.GO1_CLIENT_ID,
      client_secret: env.GO1_CLIENT_SECRET,
      scope: env.GO1_CLIENT_SCOPES,
    };

    try {
      const {
        data: { access_token },
      } = await axios.post(`${GO1_AUTH_URL}/oauth/token`, payload);
      const { data: user } = await axios.get(`${GO1_API_V2_URL}/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return {
        ...user,
        name: `${user.first_name} ${user.last_name}`,
        access_token,
      };
    } catch (error) {}
    return null;
  },
} as Provider;
