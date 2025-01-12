export const Strings = {
  contractAddress: String(process.env.NEXT_PUBLIC_ICO_CONTRACT),
};

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://orange-guava.vercel.app"
    : "http://localhost:3000";
export const callBackUrl =
  "https://orange-guava.vercel.app/api/momo-status/collection-status";
  export const merchantId = "496b952f-548b-4620-b2b7-d78d72a90b5c";
