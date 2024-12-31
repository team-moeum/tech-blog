import { fetchArticleContent, getPostPage, incrementPageView } from "@/api/notion";
import { PostRenderer } from "@/components/PostRenderer/PostRenderer";
import { Badge, Box, Flex, Heading } from "@radix-ui/themes";
import { getFormatDate } from "@/utils/getFormatDate";
import Image from "next/image";
import type { Metadata } from "next";
import { headers } from "next/headers";
import GiscusBlock from "@/components/GiscusBlock/GiscusBlock";

export async function generateMetadata({
  params
}: {
  params: { postNo: string };
}): Promise<Metadata> {
  const postInfo = await getPostPage(params.postNo);
  const defaultImageUrl = "https://blog.fin-hub.co.kr/default_cover_image.png";
  const imageUrl = postInfo.thumbnailUrl || defaultImageUrl;
  const title = `${postInfo.title}`;
  const description = "Moeum 기술 블로그";

  const headersList = headers();
  const host = headersList.get("host") as string;
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;
  const pageUrl = `${origin}/posts/${params.postNo}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Moeum 기술 블로그",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: postInfo.title
        }
      ],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}

export default async function PostPage({ params }: { params: { postNo: string } }) {
  const pageId = params.postNo;
  const postInfo = await getPostPage(pageId);
  const content = await fetchArticleContent(pageId);
  const updatedViews = await incrementPageView(pageId, postInfo.properties.views?.number ?? 0);

  return (
    <Flex
      width="100%"
      direction="column"
      align="center"
      px={{ initial: "4", md: "6", lg: "8" }}
      py="5"
    >
      <Flex
        width="100%"
        maxWidth="720px"
        direction="column"
        gap={{ initial: "3", md: "4", lg: "6" }}
      >
        <Heading size="2" color="gray">
          조회수: {updatedViews}
        </Heading>
        <Image
          src={postInfo.thumbnailUrl || ""}
          alt={`${postInfo.title}의 썸네일 이미지`}
          width={200}
          height={200}
          style={{ objectFit: "cover", width: "100%", height: 300, borderRadius: 10 }}
          priority
        />
        <Heading size={{ initial: "7", md: "8", lg: "9" }}>{postInfo.title}</Heading>
        <Heading size="2" color="gray">
          {getFormatDate(postInfo.createdAt)}
        </Heading>
        <Box maxWidth="200px">
          <Badge size="3" color="gray" radius="full">
            {postInfo.role}
          </Badge>
        </Box>
        <PostRenderer content={content.parent} />
      </Flex>
      <GiscusBlock />
    </Flex>
  );
}
