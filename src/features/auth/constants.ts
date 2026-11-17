export const SCHOOL_EMAIL_DOMAIN = "dmc.edu.ph";

// Keys match the ?error= values the backend redirects with
export const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  domain_not_allowed: `Please sign in with your official school account (@${SCHOOL_EMAIL_DOMAIN}).`,
  email_not_verified: "Your Google email address is not verified.",
  account_conflict:
    "This email is already linked to another Google account. Contact the administrator.",
  account_inactive: "Your account is inactive. Contact the administrator.",
  google_auth_failed:
    "Google sign-in was cancelled or failed. Please try again.",
};
