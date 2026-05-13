"use client";

import { useEffect } from "react";

const KEYBOARD_INSET_VAR = "--keyboard-inset";

function isLikelyMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(max-width: 767px)").matches;
}

function syncKeyboardInsetFromVisualViewport(): void {
  const vv = window.visualViewport;
  if (!vv) {
    return;
  }

  /**
   * Quando o teclado sobrepõe o layout (ex.: iOS ou overlay), a altura do
   * visual viewport fica menor que a área de layout — usamos a diferença
   * como padding para o conteúdo poder subir ao rolar.
   * Com `interactive-widget=resizes-content`, muitos browsers já redimensionam
   * o layout e esse valor tende a 0.
   */
  const overlap = Math.max(0, window.innerHeight - vv.height);
  document.documentElement.style.setProperty(
    KEYBOARD_INSET_VAR,
    `${Math.round(overlap)}px`,
  );
}

function scrollFocusedFieldIntoComfortZone(event: FocusEvent): void {
  const target = event.target;
  if (
    !(target instanceof HTMLInputElement) &&
    !(target instanceof HTMLTextAreaElement) &&
    !(target instanceof HTMLSelectElement)
  ) {
    return;
  }

  if (!isLikelyMobileViewport()) {
    return;
  }

  requestAnimationFrame(() => {
    target.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "smooth",
    });
  });
}

/**
 * Comportamento próximo ao KeyboardAvoidingView no mobile:
 * 1) Navegadores que suportam meta `interactive-widget=resizes-content` (via Next `viewport`) redimensionam o layout.
 * 2) Visual Viewport API ajusta `--keyboard-inset` quando o teclado sobrepõe.
 * 3) `scrollIntoView` no foco ajuda a manter o campo visível.
 */
export function MobileKeyboardViewport() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) {
      return;
    }

    const onVVChange = () => {
      if (!isLikelyMobileViewport()) {
        document.documentElement.style.setProperty(KEYBOARD_INSET_VAR, "0px");
        return;
      }
      syncKeyboardInsetFromVisualViewport();
    };

    const onFocusIn = (e: FocusEvent) => scrollFocusedFieldIntoComfortZone(e);

    onVVChange();
    vv.addEventListener("resize", onVVChange);
    vv.addEventListener("scroll", onVVChange);
    window.addEventListener("orientationchange", onVVChange);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      vv.removeEventListener("resize", onVVChange);
      vv.removeEventListener("scroll", onVVChange);
      window.removeEventListener("orientationchange", onVVChange);
      document.removeEventListener("focusin", onFocusIn);
      document.documentElement.style.removeProperty(KEYBOARD_INSET_VAR);
    };
  }, []);

  return null;
}
