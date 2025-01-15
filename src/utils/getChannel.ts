export default function getChannel(channel: string, type: string): number {
  if (type === "payout") {
    switch (channel) {
      case "MTN":
        return 1;
      case "Vodafone":
        return 6;
      case "AirtelTigo":
        return 7;
      default:
        return 0;
    }
  } else if (type === "collection") {
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
  } else {
    return 0;
  }
}
