// Stub helper for Firebase Admin SDK access.
// Custom passcode authentication handles session generation server-side without external dependencies.

export function isFirebaseAdminConfigured(): boolean {
  return false;
}

export async function mintCustomToken(): Promise<string | null> {
  return null;
}
