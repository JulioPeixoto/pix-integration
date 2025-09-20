export const itauConfig = {
  baseUrl: process.env.ITAU_API_BASE_URL || "https://api.itau.com.br",
  clientId: process.env.ITAU_CLIENT_ID,
  clientSecret: process.env.ITAU_CLIENT_SECRET,
  timeout: 30000,
  retries: 3,
}
