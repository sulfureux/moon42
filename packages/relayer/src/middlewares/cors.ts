import cors from "@koa/cors";

export const corsMiddleware = cors({
  origin: (ctx): string => {
    const validDomains = ["http://localhost:5173", "http://127.0.0.1:8080", "https://moon42.run", "https://linea.moon42.run"];
    if (validDomains.indexOf(ctx.request.header.origin!) !== -1) {
      return ctx.request.header.origin || "";
    }
    return "";
  },
  credentials: true,
});
