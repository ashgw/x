const basePath = "/api/auth"; // change this when changing nextJS api route

export const authEndpoints = {
  error: basePath + "/error",
  basePath,
};
export const sessionExpiry = 60 * 60 * 24 * 14; // 14 days
export const disableSignUp = true;
