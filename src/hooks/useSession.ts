"use client";

import { useCallback, useEffect, useState } from "react";

export interface SessionInfo {
  uid: string;
  role: string;
  name: string;
  email: string;
  passcodeConfigured: boolean;
}

// Resolves the current signed-in user via the app's own HttpOnly session
// cookie (see /api/auth/me), rather than Firebase's onAuthStateChanged.
// This is deliberate: a user who authenticated with a 6-digit passcode never
// signs into the Firebase client SDK at all, so onAuthStateChanged alone
// would never see them as logged in even though their session is valid.
export function useSession() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();

      if (data.authenticated) {
        setSession({
          uid: data.uid,
          role: data.role,
          name: data.name || "",
          email: data.email || "",
          passcodeConfigured: Boolean(data.passcodeConfigured),
        });
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { session, loading, refresh };
}
