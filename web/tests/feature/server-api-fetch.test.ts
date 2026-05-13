import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/i18n/server", () => ({
  getServerLocale: vi.fn(() => Promise.resolve("pt" as const)),
}));

import { serverApiFetch } from "@/lib/http/server-api";

describe("serverApiFetch", () => {
  beforeEach(() => {
    process.env.API_BASE_URL = "http://fixture.test/api";
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response("{}", { status: 200 }))),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete process.env.API_BASE_URL;
  });

  it("monta URL com API_BASE_URL e path relativo à raiz da API", async () => {
    await serverApiFetch("/me", {
      method: "GET",
      headers: { Authorization: "Bearer t" },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toBe("http://fixture.test/api/me");
    expect(init?.cache).toBe("no-store");
    const headers = new Headers(init?.headers);
    expect(headers.get("X-App-Locale")).toBe("pt");
    expect(headers.get("Accept-Language")).toContain("pt");
  });

  it("aceita path sem barra inicial", async () => {
    await serverApiFetch("login", { method: "POST", body: { a: 1 } });
    const [url] = vi.mocked(fetch).mock.calls[0] as [string];
    expect(url).toBe("http://fixture.test/api/login");
  });
});
