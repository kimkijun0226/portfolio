import { createFaviconImage } from "@/lib/favicon";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default async function AppleIcon() {
  return createFaviconImage({
    size: 180,
    fontSize: 118,
    radius: 42,
  });
}
