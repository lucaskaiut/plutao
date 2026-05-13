/**
 * Itens do menu da área autenticada (sidebar desktop + gaveta mobile).
 * Adicione entradas aqui; as etiquetas usam chaves em `nav.json`.
 */
export type PrivateNavItem = {
  href: string;
  /** Chave i18n completa, ex.: `nav.home` */
  labelKey: string;
};

export function getPrivateNavItems(): PrivateNavItem[] {
  return [{ href: "/", labelKey: "nav.home" }];
}
