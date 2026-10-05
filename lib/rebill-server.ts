import "server-only";

export function getRebillApiKey(): string | undefined {
  return process.env.NODE_ENV === "production"
    ? process.env.REBILL_API_KEY
    : process.env.REBILL_SANDBOX_API_KEY;
}
