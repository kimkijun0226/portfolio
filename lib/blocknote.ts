type BlockNoteInline = {
  text?: string;
};

type BlockNoteBlock = {
  type?: string;
  content?: BlockNoteInline[];
};

export function extractBlockNotePlainText(content: string | null): string {
  if (!content) {
    return "";
  }

  try {
    const blocks = JSON.parse(content) as BlockNoteBlock[];

    if (!Array.isArray(blocks)) {
      return "";
    }

    for (const block of blocks) {
      if (!block.content?.length) {
        continue;
      }

      const text = block.content
        .map((inline) => inline.text ?? "")
        .join("")
        .trim();

      if (text) {
        return text;
      }
    }
  } catch {
    return "";
  }

  return "";
}
