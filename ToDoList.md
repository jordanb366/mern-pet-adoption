# Heroku Deployment To‑Do

## Overview

Prepare the repo so Heroku builds the React client and serves it from the Express server.

## Files to change / add

- `server/src/server.js`: Serve client build in production.
- `client/package.json`: Add `"homepage": "."`.
- Add root `package.json` (repo root).
- Add `Procfile` (repo root).
- Set required Heroku config vars.
- Decide handling for uploads (Heroku filesystem is ephemeral).

## 1 — Serve client build from Express

Add this (after API routes, before `app.listen`) in `server/src/server.js`:

```js
// serve client build in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "..", "..", "client", "build");
  if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    });
  }
}
```

## 2 — Heroku Postbuild

Add this to `client/package.json`:

```json
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm --prefix client install && npm --prefix client run build"
```

## 3 — Heroku Run

Add this to `client/package.json`:

```json
"web": "npm start"
```

## 4 - Client package.json tweak

"homepage": "."

## 5 — Environment variables (set on Heroku)

Set these (names may vary in your code):

MONGO_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS
Any other secrets used by the server

heroku config:set MONGO_URI="your-mongo-uri" JWT_SECRET="your-jwt-secret" --app your-app-name
