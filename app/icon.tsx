import { createFaviconImage } from "@/lib/favicon";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default async function Icon() {
  return createFaviconImage({
    size: 32,
    fontSize: 22,
    radius: 8,
  });
}
