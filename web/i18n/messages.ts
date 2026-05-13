import type { AppLocale } from "@/i18n/types";

import enActions from "@/i18n/dictionaries/en/actions.json";
import enApi from "@/i18n/dictionaries/en/api.json";
import enAuth from "@/i18n/dictionaries/en/auth.json";
import enCommon from "@/i18n/dictionaries/en/common.json";
import enDashboard from "@/i18n/dictionaries/en/dashboard.json";
import enErrors from "@/i18n/dictionaries/en/errors.json";
import enHeader from "@/i18n/dictionaries/en/header.json";
import enPages from "@/i18n/dictionaries/en/pages.json";

import ptActions from "@/i18n/dictionaries/pt/actions.json";
import ptApi from "@/i18n/dictionaries/pt/api.json";
import ptAuth from "@/i18n/dictionaries/pt/auth.json";
import ptCommon from "@/i18n/dictionaries/pt/common.json";
import ptDashboard from "@/i18n/dictionaries/pt/dashboard.json";
import ptErrors from "@/i18n/dictionaries/pt/errors.json";
import ptHeader from "@/i18n/dictionaries/pt/header.json";
import ptPages from "@/i18n/dictionaries/pt/pages.json";

export const messageBundles = {
  pt: {
    actions: ptActions,
    api: ptApi,
    auth: ptAuth,
    common: ptCommon,
    dashboard: ptDashboard,
    errors: ptErrors,
    header: ptHeader,
    pages: ptPages,
  },
  en: {
    actions: enActions,
    api: enApi,
    auth: enAuth,
    common: enCommon,
    dashboard: enDashboard,
    errors: enErrors,
    header: enHeader,
    pages: enPages,
  },
} as const satisfies Record<
  AppLocale,
  Record<string, Record<string, unknown>>
>;

export type MessageBundles = typeof messageBundles;
