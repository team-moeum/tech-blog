"use client";

import React from "react";
import Slider from "react-slick";
import { Article } from "@/api/types";
import { ArticleCard } from "@/components/ArticleCard/ArticleCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from "@radix-ui/themes";
import Image from "next/image";

interface PopularProp {
  topArticles: Article[];
}

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        right: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        cursor: "pointer"
      }}
    >
      <Image src="/next_button.svg" alt="Next" width={40} height={40} />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        cursor: "pointer"
      }}
    >
      <Image src="/back_button.svg" alt="Previous" width={40} height={40} />
    </div>
  );
};

const Popular = ({ topArticles }: PopularProp) => {
  const settings = {
    dots: false,
    infinite: topArticles.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <Box pb={"50px"} width={"80%"} style={{ margin: "0 auto" }}>
      <h2>인기 아티클</h2>
      <Box
        className="popular"
        style={{
          position: "relative",
          borderRadius: "20px",
          boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Slider {...settings}>
          {[...topArticles].map(item => (
            <ArticleCard
              key={item.pageId}
              pageId={item.pageId}
              createdAt={item.createdAt}
              title={item.title}
              thumbnailUrl={item.thumbnailUrl}
              properties={item.properties}
              showCreatedAt={false}
              showRole={false}
            />
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default Popular;
