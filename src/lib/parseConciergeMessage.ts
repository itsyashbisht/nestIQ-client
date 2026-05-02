export interface HotelCard {
  _id: string;
  name: string;
  slug: string;
  city: string;
  category: string;
  vibes: string[];
  startingFrom: number;
  rating: number;
}

export interface RoomCard {
  _id: string;
  name: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
  bookingLink: string;
}

export type MessagePart =
  | { type: "text"; content: string }
  | { type: "hotels"; hotels: HotelCard[] }
  | { type: "rooms"; rooms: RoomCard[]; hotelName: string; hotelSlug: string };

export function parseConciergeMessage(text: string): MessagePart[] {
  const parts: MessagePart[] = [];

  // Split on [[HOTELS:...]] or [[ROOMS:...]] markers
  const regex = /\[\[(HOTELS|ROOMS):(\{.*?\})\]\]/gs;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index).trim();
    if (before) parts.push({ type: "text", content: before });

    // Parse the marker
    try {
      const data = JSON.parse(match[2]);
      if (match[1] === "HOTELS") {
        parts.push({ type: "hotels", hotels: data });
      } else {
        parts.push({
          type: "rooms",
          rooms: data.rooms,
          hotelName: data.hotelName,
          hotelSlug: data.hotelSlug,
        });
      }
    } catch {
      // Malformed marker -- treat as text
      parts.push({ type: "text", content: match[0] });
    }
    lastIndex = regex.lastIndex;
  }

  // Remaining text after last marker
  const remaining = text.slice(lastIndex).trim();
  if (remaining) parts.push({ type: "text", content: remaining });

  return parts;
}
