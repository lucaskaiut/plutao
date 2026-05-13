import type { AuthUser } from "@/lib/auth/types";
import { serverApiFetch } from "@/lib/http/server-api";

type LoginRegisterSuccess = {
  data: {
    token: string;
    user: AuthUser;
  };
};

export async function laravelLogin(
  email: string,
  password: string,
): Promise<
  | { ok: true; token: string; user: AuthUser }
  | { ok: false; status: number; message: string; fieldErrors?: Record<string, string[]> }
> {
  const res = await serverApiFetch("/login", {
    method: "POST",
    body: {
      channel: "internal",
      payload: { email, password },
    },
  });

  if (res.status === 200) {
    const json = (await res.json()) as LoginRegisterSuccess;
    return { ok: true, token: json.data.token, user: json.data.user };
  }

  return parseAuthError(res);
}

export async function laravelRegister(
  name: string,
  email: string,
  password: string,
): Promise<
  | { ok: true; token: string; user: AuthUser }
  | { ok: false; status: number; message: string; fieldErrors?: Record<string, string[]> }
> {
  const res = await serverApiFetch("/register", {
    method: "POST",
    body: {
      channel: "internal",
      payload: { name, email, password },
    },
  });

  if (res.status === 200) {
    const json = (await res.json()) as LoginRegisterSuccess;
    return { ok: true, token: json.data.token, user: json.data.user };
  }

  return parseAuthError(res);
}

export async function laravelMe(token: string): Promise<
  | { ok: true; user: AuthUser }
  | { ok: false; status: number }
> {
  const res = await serverApiFetch("/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 200) {
    const json = (await res.json()) as { data: { user: AuthUser } };
    return { ok: true, user: json.data.user };
  }

  return { ok: false, status: res.status };
}

async function parseAuthError(res: Response): Promise<{
  ok: false;
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
}> {
  let message = "Não foi possível concluir a operação.";
  let fieldErrors: Record<string, string[]> | undefined;

  try {
    const json = (await res.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };
    if (json.message) {
      message = json.message;
    }
    if (json.errors && typeof json.errors === "object") {
      fieldErrors = json.errors;
    }
  } catch {
    // ignore
  }

  return { ok: false, status: res.status, message, fieldErrors };
}
