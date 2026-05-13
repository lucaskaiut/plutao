import { afterEach, describe, expect, it } from "vitest";
import { getApiBaseUrl } from "@/lib/config/env";

describe("getApiBaseUrl", () => {
  const original = process.env.API_BASE_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.API_BASE_URL;
    } else {
      process.env.API_BASE_URL = original;
    }
  });

  it("lança quando API_BASE_URL não está definida", () => {
    delete process.env.API_BASE_URL;
    expect(() => getApiBaseUrl()).toThrow(/API_BASE_URL/);
  });

  it("remove barra final", () => {
    process.env.API_BASE_URL = "http://localhost:8080/api/";
    expect(getApiBaseUrl()).toBe("http://localhost:8080/api");
  });
});
