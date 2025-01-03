export default function getChannel(channel: string): number {
  switch (channel) {
    case "MTN":
      return 13;
    case "Vodafone":
      return 12;
    case "AirtelTigo":
      return 11;
    default:
      return 0;
    
  }
}
