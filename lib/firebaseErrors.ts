// Firebase's raw error messages look technical (e.g. "Firebase: Error
// (auth/email-already-in-use).") — this maps the common ones to plain
// language for the alert shown to the user.
export function getFriendlyAuthError(err: any): string {
  const code: string = err?.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in instead.";
    case "auth/invalid-email":
      return "That email address doesn't look valid.";
    case "auth/weak-password":
      return "Password is too weak — use at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "Network error — check your internet connection and try again.";
    default:
      return err?.message || "Something went wrong. Please try again.";
  }
}
