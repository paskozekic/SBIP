/** Jednostavan fetch wrapper za JSON API (Faza C). */

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseBody(r: Response): Promise<unknown> {
  const text = await r.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers as Record<string, string>),
    },
  });
  const body = await parseBody(r);
  if (!r.ok) {
    const msg =
      body && typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${r.status}`;
    throw new ApiError(msg, r.status);
  }
  return body as T;
}

export async function apiVoid(url: string, init?: RequestInit): Promise<void> {
  const r = await fetch(url, init);
  if (r.status === 204) return;
  const body = await parseBody(r);
  if (!r.ok) {
    const msg =
      body && typeof body === "object" && body !== null && "error" in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${r.status}`;
    throw new ApiError(msg, r.status);
  }
}
