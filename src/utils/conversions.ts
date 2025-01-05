export function toUSDC(weiAmount: bigint): string {
  return (Number(weiAmount) / 1e6).toString();
}

export function toUwei(usdcAmount: string): bigint {
  return BigInt(Number(usdcAmount) * 1e6);
}
