import { Box, Flex, Link, Text } from "@radix-ui/themes";
import Image from "next/image";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Article } from "@/api/types";

type ArticleCardProps = Article;

export const ArticleCard = ({
  pageId,
  title,
  createdAt,
  thumbnailUrl,
  properties,
  showCreatedAt = true,
  showRole = true
}: ArticleCardProps) => {
  const roles = properties.role?.multi_select;
  return (
    <Link href={`/posts/${pageId}`} underline="none">
      <Box className="article_box">
        <Flex direction="column">
          <Box
            className="img_box"
            position="relative"
            overflow="hidden"
            width="100%"
            height="300px"
            style={{
              borderRadius: showCreatedAt ? 20 : 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20
            }}
          >
            <Image
              src={thumbnailUrl || ""}
              alt="article thumnail image"
              fill
              style={{ objectFit: "cover" }}
              className="thumbnail"
            />
          </Box>
          <Text
            style={{
              marginTop: "20px",
              marginInline: showCreatedAt ? "0px" : "20px",
              color: "#191B1c",
              fontFamily: "Pretendard Variable",
              fontSize: "24px",
              fontWeight: 700
            }}
          >
            {title}
          </Text>
          <Text size="1" mt="2" style={{ color: "#7B8287" }}>
            {showCreatedAt &&
              (createdAt instanceof Date
                ? createdAt.toISOString().slice(0, 10)
                : new Date(createdAt).toISOString().slice(0, 10))}
          </Text>
          <Box mt={"15px"}>
            {showRole &&
              roles?.map((role: any, index: number) => (
                <Box
                  key={index}
                  p={"7px 14px"}
                  style={{
                    backgroundColor: "#E6E8EB",
                    borderRadius: "20px",
                    display: "inline-flex",
                    height: "36px"
                  }}
                >
                  <Text style={{ color: "#7B8287", fontSize: "14px" }}>{role.name}</Text>
                </Box>
              ))}
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};
