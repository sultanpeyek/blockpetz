export const BASE_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://blockpetz.vercel.app"
    : "http://localhost:3000";
export const UPDATE_AUTHORITY = "PYKjwrSNWUmvy9VbSbYizi4xaC7MiCY1RNxq99UgU6X";
export const EXP_PER_FEED = 100;
export const EXP_PER_LEVEL = 500;
