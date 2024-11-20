import { Client } from "@notionhq/client";
import {
  DatabaseObjectResponse,
  PageObjectResponse
} from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import { Article, MultiSelectOption } from "./types";

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN
});

export const n2m = new NotionToMarkdown({
  notionClient: notionClient,
  config: {
    parseChildPages: false
  }
});

/**
 * 조회수를 증가시키는 함수
 */
export async function incrementPageView(
  pageId: string,
  currentViews: number | null
): Promise<number> {
  const updatedViews = (currentViews ?? 0) + 1;

  await notionClient.pages.update({
    page_id: pageId,
    properties: {
      views: {
        number: updatedViews
      }
    }
  });

  return updatedViews;
}

/**
 * get notion database
 */
export async function queryNotionDatabase(
  startCursor?: string,
  isPopular = false,
  role?: string | undefined
) {
  try {
    const filters: any = [
      {
        property: "exposure",
        checkbox: {
          equals: true
        }
      }
    ];

    if (role) {
      filters.push({
        property: "role",
        multi_select: {
          contains: role
        }
      });
    }
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: filters
      },
      start_cursor: startCursor || undefined,
      page_size: isPopular ? undefined : 4
    });

    return {
      results: response.results as DatabaseObjectResponse[],
      nextCursor: response.next_cursor
    };
  } catch (error) {
    console.error("Error in queryNotionDatabase function:", error);
  }
}

export async function getArticleInfoList(
  isPopular = false,
  role?: string,
  startCursor?: string
): Promise<{ articles: Article[]; nextCursor?: string | null; role?: string | undefined }> {
  const result = await queryNotionDatabase(
    startCursor,
    isPopular,
    role === "전체" ? undefined : role
  );

  if (!result) {
    return { articles: [], nextCursor: null };
  }

  const { results, nextCursor } = result;

  const articleList = results.map(item => {
    const itemName = item.properties.name as any;
    const title = itemName.title[0].plain_text;
    const coverImageUrl = getCoverImageUrl(item);

    return {
      pageId: item.id,
      title: title,
      createdAt: new Date(item.created_time),
      thumbnailUrl: coverImageUrl,
      properties: item.properties
    };
  });

  return { articles: articleList as Article[], nextCursor };
}

/**
 * get notion page data
 * @param pageId notion page Id
 */
export async function getPageInfo(pageId: string): Promise<PageObjectResponse> {
  try {
    const response = await notionClient.pages.retrieve({ page_id: pageId });
    return response as PageObjectResponse;
  } catch (error) {
    console.error("Error fetching page info:", error);
    throw error;
  }
}

/**
 * get published notion image url
 */

function covertToPublishImgUrl(url: string, projectId: string) {
  const encodedUrl = encodeURIComponent(url.split("?")[0]);
  const publishImgUrl = `https://lemon-mosquito-5dc.notion.site/image/${encodedUrl}?table=block&id=${projectId}&cache=v2`;
  return publishImgUrl;
}

/**
 * get article info list from database
 */
const getCoverImageUrl = (item: DatabaseObjectResponse): string => {
  if (item.cover?.type === "file") {
    const originalImgUrl = item.cover?.file.url;
    const publishImgUrl = covertToPublishImgUrl(originalImgUrl, item.id);
    return publishImgUrl;
  } else if (item.cover?.type === "external") {
    const originalImgUrl = item.cover?.external.url;
    const publishImgUrl = covertToPublishImgUrl(originalImgUrl, item.id);
    return publishImgUrl;
  } else {
    return "/default_cover_image.png";
  }
};
/**
 * get notion page markdown
 * @param pageId notion page id
 */
export const fetchArticleContent = async (pageId: string) => {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const customizedMdBlocks = customizeMdBlocks(mdBlocks);
  return n2m.toMarkdownString(customizedMdBlocks);
};

/**
 * Add notion block type as md className
 */
function customizeMdBlocks(blocks: any[]) {
  return blocks.map(block => {
    if (block.children.length) return block;

    const newContent =
      block.parent + "\n" + "<!--rehype:class=finhub-" + block.type + "-->" + "\n ";

    return {
      ...block,
      parent: newContent
    };
  });
}

export const searchArticle = async (key: string) => {
  try {
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: "exposure",
            checkbox: {
              equals: true
            }
          },
          {
            property: "title",
            rich_text: {
              contains: key
            }
          }
        ]
      }
    });
    const result = response.results as DatabaseObjectResponse[];

    const titleList = result.map(item => {
      const itemName = item.properties.name as any;
      const title = itemName.title[0].plain_text;
      const coverImageUrl =
        item.cover?.type === "file" ? item.cover?.file.url : "/default_cover_image.png";
      return {
        pageId: item.id,
        title: title,
        createdAt: new Date(item.created_time),
        thumbnailUrl: coverImageUrl,
        properties: item.properties
      };
    });
    return titleList;
  } catch (error) {
    console.error("Error in searchArticle function:", error);
    throw new Error("Error in searchArticle function");
  }
};

/*
 * pageId로 title, createdAt, role, coverImage를 가져오는 함수
 */
interface PostPage extends Article {
  role: string;
}

export async function getPostPage(pageId: string): Promise<PostPage> {
  try {
    const pageInfo = await getPageInfo(pageId);
    const nameProperty = pageInfo.properties.name;
    const title =
      nameProperty?.type === "title" && nameProperty.title?.[0]?.plain_text
        ? nameProperty.title[0].plain_text
        : "제목 없음";
    const createdAt = new Date(pageInfo.created_time);
    const roleProperty = pageInfo.properties.role;
    const role =
      roleProperty?.type === "multi_select" && roleProperty.multi_select
        ? roleProperty.multi_select
            .map((selectItem: MultiSelectOption) => selectItem.name)
            .join(", ")
        : "None";
    const coverImageUrl =
      pageInfo.cover?.type === "file" && pageInfo.cover.file
        ? pageInfo.cover.file.url
        : "/default_cover_image.png";
    return {
      pageId,
      title,
      createdAt,
      thumbnailUrl: coverImageUrl,
      properties: pageInfo.properties,
      role
    };
  } catch (error) {
    console.error("Error fetching postPage:", error);
    throw error;
  }
}

// 조회수 순으로 상위 5개
export function getTopFiveArticles(articles: Article[]): Article[] {
  const topFiveArticles = articles
    .sort(
      (postA, postB) =>
        (postB.properties.views?.number ?? 0) - (postA.properties.views?.number ?? 0)
    )
    .slice(0, 5);

  return topFiveArticles;
}
