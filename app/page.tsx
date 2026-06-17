import { HomePage } from "@/components/home/HomePage";
import { getPortfolioProjects } from "@/lib/projects/getPortfolioProjects";

/**
 * [성능] ISR(Incremental Static Regeneration) — 60초마다 페이지를 재검증합니다.
 *
 * 이전 문제: export const dynamic = "force-dynamic"
 * → 방문할 때마다 서버가 Supabase 응답을 기다린 뒤 HTML을 만들어 첫 로딩이 길었습니다.
 *
 * 해결: revalidate로 정적 페이지(○)로 제공하고, 데이터는 getPortfolioProjects의
 * unstable_cache와 함께 캐시해 대부분의 요청에서 DB 왕복 없이 HTML을 내려줍니다.
 */
export const revalidate = 60;

export default async function Page() {
  const projects = await getPortfolioProjects();

  return <HomePage projects={projects} />;
}
