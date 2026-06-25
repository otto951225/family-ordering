export function getClientId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  const key = "family-ordering-client-id";
  const existing = window.localStorage.getItem(key);
  if (existing) {
    return existing;
  }

  const next = crypto.randomUUID();
  window.localStorage.setItem(key, next);
  return next;
}

export function getUserName(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("family-ordering-user-name");
}

export function setUserName(name: string) {
  window.localStorage.setItem("family-ordering-user-name", name.trim());
}
