export const Variables = {
  contractAddress: String(process.env.NEXT_PUBLIC_ICO_CONTRACT),
};

export const baseUrl = process.env.NODE_ENV === 'production'? "https://guava-pear.vercel.app":"http://localhost:3000"