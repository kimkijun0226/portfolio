type BlockNoteInline = {
  type?: string;
  text?: string;
  href?: string;
  content?: BlockNoteInline[];
};

type BlockNoteBlock = {
  type?: string;
  content?: BlockNoteInline[];
  children?: BlockNoteBlock[];
};

export type BlockNotePortfolioLinks = {
  liveUrl?: string;
  githubUrl?: string;
};

function extractUrlFromInline(inline: BlockNoteInline): string | undefined {
  if (inline.type === "link" && inline.href) {
    return inline.href.trim();
  }

  const text = inline.text?.trim();

  if (!text) {
    return undefined;
  }

  const match = text.match(/https?:\/\/\S+/);

  return match?.[0].replace(/[),.;]+$/g, "");
}

function extractLinksFromParagraph(
  block: BlockNoteBlock
): BlockNotePortfolioLinks | null {
  if (block.type !== "paragraph" || !block.content?.length) {
    return null;
  }

  const label = block.content[0]?.text?.trim();

  if (label !== "Link" && label !== "GitHub") {
    return null;
  }

  for (const inline of block.content) {
    const url = extractUrlFromInline(inline);

    if (!url) {
      continue;
    }

    if (label === "Link") {
      return { liveUrl: url };
    }

    return { githubUrl: url };
  }

  return null;
}

function walkBlocks(
  blocks: BlockNoteBlock[],
  onBlock: (block: BlockNoteBlock) => void
) {
  for (const block of blocks) {
    onBlock(block);

    if (block.children?.length) {
      walkBlocks(block.children, onBlock);
    }
  }
}

export function extractBlockNotePortfolioLinks(
  content: string | null
): BlockNotePortfolioLinks {
  if (!content) {
    return {};
  }

  try {
    const blocks = JSON.parse(content) as BlockNoteBlock[];

    if (!Array.isArray(blocks)) {
      return {};
    }

    const links: BlockNotePortfolioLinks = {};

    walkBlocks(blocks, (block) => {
      const paragraphLinks = extractLinksFromParagraph(block);

      if (!paragraphLinks) {
        return;
      }

      if (paragraphLinks.liveUrl) {
        links.liveUrl = paragraphLinks.liveUrl;
      }

      if (paragraphLinks.githubUrl) {
        links.githubUrl = paragraphLinks.githubUrl;
      }
    });

    return links;
  } catch {
    return {};
  }
}

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
