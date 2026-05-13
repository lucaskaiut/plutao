/**
 * URL base da API Laravel, **incluindo** o prefixo `/api` (sem barra final).
 * Ex.: `http://localhost:8080/api` ou `http://nginx/api` no Docker.
 */
export function getApiBaseUrl(): string {
  const raw = process.env.API_BASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "Defina a variável de ambiente API_BASE_URL (ex.: http://localhost:8080/api).",
    );
  }
  return raw.replace(/\/$/, "");
}
