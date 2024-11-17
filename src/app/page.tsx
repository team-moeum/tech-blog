import { getArticleInfoList, getTopFiveArticles } from "@/api/notion";
import "./page.css";
import FilterableArticleList from "./_component/main/FilterableArticleList";
import Popular from "./_component/main/Popular";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: { role?: string } }) {
  const selectedRole = searchParams.role || "전체";
  const { articles: initialArticles, nextCursor } = await getArticleInfoList(false, selectedRole);
  const { articles: popularArticles } = await getArticleInfoList(true);
  const topFiveArticles = getTopFiveArticles(popularArticles);

  const allRoles = Array.from(
    new Set(
      popularArticles.flatMap(article =>
        article.properties.role?.multi_select.map((role: any) => role.name)
      )
    )
  );
  const roles = ["전체", ...allRoles];

  return (
    <>
      <Popular topArticles={topFiveArticles} />
      <Suspense>
        <FilterableArticleList
          initialArticles={initialArticles}
          roles={roles}
          nextCursor={nextCursor}
        />
      </Suspense>
    </>
  );
}
