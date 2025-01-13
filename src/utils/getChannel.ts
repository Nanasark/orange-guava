export default function getChannel(channel: string): number {
  switch (channel) {
    case "MTN":
      return 13;
    case "Vodafone":
      return 6;
    case "AirtelTigo":
      return 7;
    default:
      return 0;
  }
}
