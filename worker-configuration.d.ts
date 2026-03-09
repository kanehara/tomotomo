// Cloudflare binding types — regenerate with `npm run types` after creating D1 database.
// Augments the Cloudflare.Env interface used by `import { env } from "cloudflare:workers"`.

declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
  }
}
