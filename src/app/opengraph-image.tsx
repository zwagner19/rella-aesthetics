import { ImageResponse } from "next/og";
import {
  RellaSocialCard,
  SOCIAL_CARD_ALT,
  SOCIAL_CARD_SIZE,
} from "@/lib/social-card";

export const alt = SOCIAL_CARD_ALT;
export const size = SOCIAL_CARD_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<RellaSocialCard />, size);
}
