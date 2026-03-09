/**
 * Cloudflare Worker entry point for tomotomo (App Router).
 *
 * Delegates all requests to vinext's App Router handler.
 * Image optimization is not needed for this app.
 *
 * If you need image optimization, see vinext/server/image-optimization.
 */
import handler from "vinext/server/app-router-entry";

export default {
  async fetch(request: Request): Promise<Response> {
    return handler.fetch(request);
  },
};
