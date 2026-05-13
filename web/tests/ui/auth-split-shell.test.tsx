import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";

describe("AuthSplitShell (UI)", () => {
  it("renderiza painel de marca com classes de cor primária e altura mínima em mobile", () => {
    render(
      <AuthSplitShell
        brandLabel="Marca"
        title="Título"
        subtitle="Subtítulo"
      >
        <div>Formulário</div>
      </AuthSplitShell>,
    );

    const panel = screen.getByTestId("auth-brand-panel");
    expect(panel).toHaveClass("bg-primary");
    expect(panel).toHaveClass("text-primary-foreground");
    expect(panel).toHaveClass("min-h-[32vh]");
    expect(panel).toHaveClass("md:w-[60%]");

    expect(within(panel).getByText("Título")).toBeInTheDocument();
    expect(screen.getByText("Formulário")).toBeInTheDocument();
  });
});
