"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";

/**
 * Revalida a sessão no cliente via BFF (contexto), após o layout servidor
 * já ter garantido acesso com `assertAuthenticatedLayout`.
 */
export function PrivateAuthSync() {
  const { verifySession } = useAuth();

  useEffect(() => {
    void verifySession();
  }, [verifySession]);

  return null;
}
