"use client";

import { useTheme } from "next-themes";
import { Button, Link, Flex, Text, Strong } from "@radix-ui/themes";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import "./NavBar.css";
import SearchModal from "../SearchModal/SearchModal";

export function NavBar() {
  const { theme, setTheme } = useTheme();
  const toggleMode = () => setTheme(theme == "light" ? "dark" : "light");

  return (
    <header className="navBar">
      <Flex align="center" width={"100%"} height={"65px"} justify={"between"}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            textDecoration: "none"
          }}
        >
          <div style={{ position: "relative", width: "32px", height: "32px" }}>
            <Image
              src="/app_icon.svg"
              alt="app_icon"
              fill
              style={{ justifyContent: "center", alignContent: "center" }}
            />
          </div>
          <Text
            style={{
              color: "var(--gray-12)"
            }}
          >
            <Strong>Moeum </Strong>tech
          </Text>
        </Link>
        <Flex align="center" gap="24px">
          <SearchModal />
          <Button
            size="1"
            color="green"
            variant="ghost"
            style={{ width: "32px", height: "32px", padding: "0" }}
            onClick={toggleMode}
          >
            {theme === "dark" ? (
              <MoonIcon width="20" height="20" />
            ) : (
              <SunIcon width="20" height="20" />
            )}
          </Button>
        </Flex>
      </Flex>
    </header>
  );
}
