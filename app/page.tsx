import { HomePage } from "@/components/home/HomePage";
import { getPortfolioProjects } from "@/lib/projects/getPortfolioProjects";

export const revalidate = 60;

export default async function Page() {
  const projects = await getPortfolioProjects();

  return <HomePage projects={projects} />;
}
