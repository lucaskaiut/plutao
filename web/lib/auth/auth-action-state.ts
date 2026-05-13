export type AuthActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };
