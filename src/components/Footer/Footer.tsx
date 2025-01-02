"use client";

import { useTheme } from "next-themes";
import { Button, Link, Flex, Text, Strong } from "@radix-ui/themes";
import { SunIcon, MoonIcon, GitHubLogoIcon, DownloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import "./Footer.css";
import SearchModal from "../SearchModal/SearchModal";
import { github, finhubGoogle, finhubIos } from "@/app/_constants/link";

export function Footer() {
  return (
    <footer className="footer">
      <Flex align="center" justify="center" width={"100%"}>
        <Link
          href={github}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--gray-12)"
          }}
        >
          <GitHubLogoIcon width={"32px"} height={"32px"} />
          <Text size={"1"}>© 2024 Moeum</Text>
        </Link>
      </Flex>
      <Text size={"1"} color="gray">
        Download Finhub
      </Text>
      <Flex align="center" justify="center" gap="20px">
        <Link href={finhubGoogle}>
          <Button
            size="1"
            color="gray"
            variant="outline"
            style={{ width: "100px", height: "32px", padding: "0", cursor: "pointer" }}
          >
            <DownloadIcon />
            Google Play
          </Button>
        </Link>
        <Link href={finhubIos}>
          <Button
            size="1"
            color="gray"
            variant="outline"
            style={{ width: "100px", height: "32px", padding: "0", cursor: "pointer" }}
          >
            <DownloadIcon />
            App Store
          </Button>
        </Link>
      </Flex>
    </footer>
  );
}
