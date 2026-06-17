import { unstable_cache } from "next/cache";
import { fallbackProjects, projectsIntro, type Project } from "@/data/projects";
import { portfolioSiteDevSections } from "@/data/portfolioSiteDev";
import {
  extractBlockNotePlainText,
  extractBlockNotePortfolioLinks,
} from "@/lib/blocknote";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const PORTFOLIO_TOPIC_CATEGORY = "portfolio";

/** Supabase topic 조회 + unstable_cache 재검증 주기(초). page.tsx revalidate와 맞춥니다. */
export const PORTFOLIO_REVALIDATE_SECONDS = 60;

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

function attachPortfolioDevNotes(projects: Project[]): Project[] {
  // 이 포트폴리오 사이트(topic 128) 카드에만 '개발 정리' 섹션 데이터를 붙입니다.
  return projects.map((project) => {
    if (project.id === "topic-128" || project.topicId === 128) {
      return { ...project, devSections: portfolioSiteDevSections };
    }

    return project;
  });
}

async function fetchPortfolioProjects(): Promise<Project[]> {
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
      return attachPortfolioDevNotes(fallbackProjects);
    }

    const projects = (data ?? [])
      .map((row) => mapTopicToProject(row as PortfolioTopicRow))
      .filter((project): project is Project => project !== null);

    return attachPortfolioDevNotes(
      projects.length > 0 ? projects : fallbackProjects
    );
  } catch (error) {
    console.error("[getPortfolioProjects]", error);
    return attachPortfolioDevNotes(fallbackProjects);
  }
}

/**
 * [성능] Next.js unstable_cache — 동일한 Supabase 조회 결과를 서버 메모리에 잠깐 보관합니다.
 *
 * fetchPortfolioProjects: 실제 DB 쿼리 함수
 * ["portfolio-projects"]: 캐시 키
 * revalidate: 60 — 60초 지나면 다음 요청 때 백그라운드 갱신
 */
const getCachedPortfolioProjects = unstable_cache(
  fetchPortfolioProjects,
  ["portfolio-projects"],
  { revalidate: PORTFOLIO_REVALIDATE_SECONDS, tags: ["portfolio-projects"] }
);

export async function getPortfolioProjects(): Promise<Project[]> {
  return getCachedPortfolioProjects();
}

export { projectsIntro };
