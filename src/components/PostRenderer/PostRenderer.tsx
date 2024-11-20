import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import "./mark-down-style.css";
import {
  BlockQuote,
  CodeBlock,
  Anchor,
  Paragraph,
  Callout,
  IndexList,
  CustomCheckbox
} from "./components";
import React from "react";
import { Box, Em, Heading } from "@radix-ui/themes";
import rehypeRaw from "rehype-raw";
import rehypeAttrs from "rehype-attr";

const getHeadingText = (children: React.ReactNode): string => {
  const headingText = React.Children.toArray(children)
    .filter(child => typeof child === "string")
    .join(" ");

  return headingText;
};

export const PostRenderer = ({ content }: { content?: string }) => {
  if (!content) return <Em>글 작성중 입니다!</Em>;
  return (
    <Box>
      <IndexList content={content} />
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, [rehypeAttrs, { properties: "attr" }]]}
        components={{
          img: ({ node, ...props }) => (
            <Image
              src={props.src || ""}
              alt={props.alt || ""}
              width={500}
              height={300}
              style={{ width: "100%", height: "auto", borderRadius: "10px" }}
              className={props.className}
            />
          ),
          code: CodeBlock,
          blockquote: ({ ...props }) => {
            if (props.className === "finhub-callout") {
              return <Callout>{props.children}</Callout>;
            }

            return <BlockQuote {...props} />;
          },
          a: Anchor,
          p: Paragraph,
          h1: props => (
            <Heading
              size="7"
              as="h1"
              id={getHeadingText(props.children)}
              className={props.className}
            >
              {props.children}
            </Heading>
          ),
          h2: props => (
            <Heading
              size="6"
              as="h2"
              id={getHeadingText(props.children)}
              className={props.className}
            >
              {props.children}
            </Heading>
          ),
          h3: props => (
            <Heading
              size="5"
              as="h3"
              id={getHeadingText(props.children)}
              className={props.className}
            >
              {props.children}
            </Heading>
          ),
          input: ({ node, ...props }) => {
            if (props.type === "checkbox") {
              return <CustomCheckbox checked={props.checked ?? false} />;
            }
            return <input {...props} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};
