import { fallbackProjects, projectsIntro, type Project } from "@/data/projects";
import {
  extractBlockNotePlainText,
  extractBlockNotePortfolioLinks,
} from "@/lib/blocknote";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const PORTFOLIO_TOPIC_CATEGORY = "portfolio";

type PortfolioTopicRow = {
  id: number;
  title: string | null;
  summary: string | null;
  content: string | null;
  thumbnail: string | null;
  portfolio_chips: string[] | null;
  live_url: string | null;
  github_url: string | null;
  portfolio_tag: string | null;
};

function mapTopicToProject(topic: PortfolioTopicRow): Project | null {
  if (!topic.title) {
    return null;
  }

  const contentLinks = extractBlockNotePortfolioLinks(topic.content);

  const description =
    topic.summary?.trim() ||
    extractBlockNotePlainText(topic.content) ||
    "프로젝트 소개를 준비 중입니다.";

  return {
    id: `topic-${topic.id}`,
    topicId: topic.id,
    title: topic.title,
    description,
    tag: topic.portfolio_tag ?? "사이드 프로젝트",
    image: topic.thumbnail ?? undefined,
    imageAlt: topic.title,
    liveUrl: topic.live_url ?? contentLinks.liveUrl,
    githubUrl: topic.github_url ?? contentLinks.githubUrl,
    chips: topic.portfolio_chips ?? [],
  };
}

export async function getPortfolioProjects(): Promise<Project[]> {
  try {
    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("topic")
      .select(
        "id, title, summary, content, thumbnail, portfolio_chips, live_url, github_url, portfolio_tag"
      )
      .eq("category", PORTFOLIO_TOPIC_CATEGORY)
      .eq("status", "publish")
      .eq("visibility", "PUBLIC")
      .eq("show_in_portfolio", true)
      .not("title", "is", null)
      .order("portfolio_sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[getPortfolioProjects]", error.message);
      return fallbackProjects;
    }

    const projects = (data ?? [])
      .map((row) => mapTopicToProject(row as PortfolioTopicRow))
      .filter((project): project is Project => project !== null);

    return projects.length > 0 ? projects : fallbackProjects;
  } catch (error) {
    console.error("[getPortfolioProjects]", error);
    return fallbackProjects;
  }
}

export { projectsIntro };
