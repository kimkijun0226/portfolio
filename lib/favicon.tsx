import { ImageResponse } from "next/og";

const SPACE_GROTESK_SEMIBOLD_URL =
  "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj42Vksj.ttf";

let fontDataPromise: Promise<ArrayBuffer> | null = null;

function loadSpaceGroteskSemiBold() {
  if (!fontDataPromise) {
    fontDataPromise = fetch(SPACE_GROTESK_SEMIBOLD_URL).then((response) =>
      response.arrayBuffer()
    );
  }

  return fontDataPromise;
}

type FaviconOptions = {
  size: number;
  fontSize: number;
  radius: number;
};

export async function createFaviconImage({
  size,
  fontSize,
  radius,
}: FaviconOptions) {
  const fontData = await loadSpaceGroteskSemiBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          borderRadius: radius,
          border: "1px solid rgba(255, 255, 255, 0.16)",
        }}
      >
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize,
            fontWeight: 600,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            transform: "translateY(1px)",
          }}
        >
          K
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}
