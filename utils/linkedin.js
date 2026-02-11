export const getLinkedInAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI
  );
  const scope = encodeURIComponent("openid profile email");
  const state = Math.random().toString(36).substring(7); // Random state for CSRF protection

  // Store state in sessionStorage for verification
  if (typeof window !== "undefined") {
    sessionStorage.setItem("linkedin_oauth_state", state);
  }

  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
};
