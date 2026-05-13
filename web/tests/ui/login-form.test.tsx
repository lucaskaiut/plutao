import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/components/auth/login-form";
import { I18nProvider } from "@/i18n/i18n-provider";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock("@/app/actions/auth", () => ({
  loginAction: vi.fn(async () => ({ status: "idle" as const })),
}));

describe("LoginForm (UI)", () => {
  it("renderiza campos e botão primário", () => {
    render(
      <I18nProvider initialLocale="pt">
        <LoginForm />
      </I18nProvider>,
    );

    expect(screen.getByRole("textbox", { name: /e-mail/i })).toBeVisible();
    expect(screen.getByLabelText(/senha/i)).toBeVisible();
    const submit = screen.getByRole("button", { name: /entrar/i });
    expect(submit).toBeVisible();
    expect(submit).toHaveClass("btn-primary");
  });
});
