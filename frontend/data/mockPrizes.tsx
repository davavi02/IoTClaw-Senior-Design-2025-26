// data/mockPrizes.ts
import type { Prize } from "../types/prize";

export const MOCK_PRIZES: Prize[] = [
  {
    id: "1",
    name: "Golden Claw",
    description: "Pulled the rare golden claw from the machine.",
    dateWon: "2025-11-01T00:00:00Z",
    imageUrl: "https://picsum.photos/seed/claw/200/200",

    isDelivered: true,
    isShipped: true,
  },
  {
    id: "2",
    name: "Mega Token",
    description: "Won from the mega bonus round.",
    dateWon: "2025-11-10T00:00:00Z",
    imageUrl: "https://picsum.photos/seed/token/200/200",

    isDelivered: false,
    isShipped: true,
  },
  {
    id: "3",
    name: "Stuffed Dragon",
    description: "Legendary prize from the clawzer pit.",
    dateWon: "2025-11-20T00:00:00Z",
    imageUrl: "https://picsum.photos/seed/dragon/200/200",

    isDelivered: false,
    isShipped: false,
  },
];
