import { HomePage } from "@/components/HomePage";
import { getPortfolioProjects } from "@/lib/projects/getPortfolioProjects";

// 블로그 topic 변경을 새로고침마다 반영 (ISR 캐시 없음)
export const dynamic = "force-dynamic";

export default async function Page() {
  const projects = await getPortfolioProjects();

  return <HomePage projects={projects} />;
}
