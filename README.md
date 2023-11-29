# Create Go1 Third Party App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Go1d](https://go1d.go1.com/)

## Where do I start?

The base app comes with a few pages and components to get you started. You can find them in the `src/pages` and `src/components` directories.

Feel free to remove them and start from scratch if you prefer.

## How do I run this app?

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## How do I deploy this app?

```bash
# Build the app for production
npm run build

# Run the production server
npm start
```

## Authentication

This app uses [NextAuth.js](https://next-auth.js.org) for authentication. You can find the configuration in `src/server/auth.ts`. It comes with two providers: `Go1 Credentials` and `Go1 Authorization Flow`.

### Go1 Credentials

This is the default provider. It uses the `go1` username and password to authenticate the user. You can find the configuration in `src/server/providers.ts`.

### Go1 Authorization Flow

This provider uses the [OAuth 2.0 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-4.1) to authenticate the user. You can find the configuration in `src/server/providers.ts`.
