# Cube Icons

Node.js website ready for Render.

## Local run

```bash
npm install
npm start
```

The server uses `PORT` when set. Without `PORT`, it runs on `8000`.

## Render deploy

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from the repo.
3. Render reads `render.yaml`, runs `npm install && npm run build`, then starts with `npm start`.

Health check path: `/healthz`.
