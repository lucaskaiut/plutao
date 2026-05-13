import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import { MobileKeyboardViewport } from "@/components/layout/mobile-keyboard-viewport";
import { I18nProvider } from "@/i18n/i18n-provider";
import { localeToHtmlLang } from "@/i18n/locale";
import { getServerLocale, getServerTranslate } from "@/i18n/server";
import { getCurrentUser } from "@/lib/auth/session";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslate();
  return {
    title: translate("common.metaTitle"),
    description: translate("common.metaDescription"),
  };
}

/**
 * `interactive-widget=resizes-content`: o layout viewport acompanha o teclado
 * virtual (Chrome Android, etc.), empurrando o conteúdo em vez de só sobrepor.
 * @see https://developer.chrome.com/blog/viewport-resize-behavior
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const locale = await getServerLocale();

  return (
    <html
      lang={localeToHtmlLang(locale)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <MobileKeyboardViewport />
        <I18nProvider key={locale} initialLocale={locale}>
          <AuthProvider
            key={user ? `u:${user.id}` : "guest"}
            initialUser={user}
          >
            {children}
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
