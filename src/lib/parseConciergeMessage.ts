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
}

export type MessagePart =
  | { type: "text"; content: string }
  | { type: "hotels"; hotels: HotelCard[] }
  | { type: "rooms"; rooms: RoomCard[]; hotelName: string; hotelSlug: string }
  | { type: "bookingLink"; link: string };

// ─── Parser ───────────────────────────────────────────────────────────────────
// Handles 3 markers injected by the controller:
//   [[HOTELS:{...}]]       → hotel cards
//   [[ROOMS:{...}]]        → room cards
//   [[BOOKING_LINK:{...}]] → booking CTA button
//
// Regex: non-greedy [\s\S]*? between marker-start and ]] is safe because
// JSON values never contain ]] (double closing bracket) naturally.

const MARKER_RE = /\[\[(HOTELS|ROOMS|BOOKING_LINK):([\s\S]*?)\]\]/g;

export function parseConciergeMessage(text: string): MessagePart[] {
  if (!text) return [];

  const parts: MessagePart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MARKER_RE.lastIndex = 0; // always reset — regex is module-level and stateful

  while ((match = MARKER_RE.exec(text)) !== null) {
    // Plain text before this marker
    const before = text.slice(lastIndex, match.index).trim();
    if (before) parts.push({ type: "text", content: before });

    try {
      const kind = match[1];
      const data = JSON.parse(match[2]);

      if (kind === "HOTELS") {
        // shape: { hotels: HotelCard[] }  OR  HotelCard[]  (defensive)
        const hotels: HotelCard[] = Array.isArray(data)
          ? data
          : (data.hotels ?? []);
        if (hotels.length) parts.push({ type: "hotels", hotels });
      } else if (kind === "ROOMS") {
        // shape: { rooms: RoomCard[], hotelName: string, hotelSlug: string }
        const rooms: RoomCard[] = Array.isArray(data.rooms) ? data.rooms : [];
        if (rooms.length) {
          parts.push({
            type: "rooms",
            rooms,
            hotelName: data.hotelName ?? "",
            hotelSlug: data.hotelSlug ?? "",
          });
        }
      } else if (kind === "BOOKING_LINK") {
        // shape: { link: string }
        if (data.link) parts.push({ type: "bookingLink", link: data.link });
      }
    } catch {
      // Malformed JSON inside marker → render raw as text
      parts.push({ type: "text", content: match[0] });
    }

    lastIndex = MARKER_RE.lastIndex;
  }

  // Remaining plain text after the last marker
  const tail = text.slice(lastIndex).trim();
  if (tail) parts.push({ type: "text", content: tail });

  return parts;
}
