export function ContractAddress(chain: string): string {
  switch (chain) {
    case "POLYGON":
      return "0x46aa26bdca96fa57025c3d6a067e82e3e65d53f3";
    case "SCROLL":
      return "0xE38d1D31e6B75a95516857ce5bAdbF70C5464cd7";
    case "CELO":
      return "0x1AC513717801c2FD691db6302dCf9F9e4234f957";
    default:
      return "0x1AC513717801c2FD691db6302dCf9F9e4234f957";
  }
}

export function USDCAddress(chain: string): string {
  switch (chain) {
    case "POLYGON":
      return "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    case "SCROLL":
      return "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4";
    case "CELO":
      return "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
    default:
      return "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";
  }
}
