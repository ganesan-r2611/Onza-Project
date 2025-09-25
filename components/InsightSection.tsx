"use client";

import React from "react";
import Image from "next/image";
import blogsData from "@/json/insight-blog.json";
import { imageMap } from "@/libs/imageMap";
import Link from "next/link";

/**
 * 3-column layout:
 *  - Desktop (lg+): grid-cols-3, each column stacks cards vertically
 *  - Mobile: single column
 *
 * Order (matching screenshot):
 *  LEFT column: heading, card[0] (big), card[1] (small)
 *  MIDDLE col: card[2] (big), card[3] (small), CTA
 *  RIGHT col: subtitle, card[4] (small), card[5] (big)
 *
 * Make all cards the same CARD_HEIGHT or override per-card by passing h prop.
 */

const CARD_HEIGHT = "h-[360px]"; // set global card height here

export default function InsightsSection() {
  const posts = blogsData.posts || [];

  const Card: React.FC<{ post: any; h?: string }> = ({
    post,
    h = CARD_HEIGHT,
  }) => {
    const img = imageMap[post.imageKey];

    return (
      <article className="relative w-full rounded-[18px] overflow-hidden card-border flex flex-col">
        <div className={`relative ${h} w-full flex flex-col`}>
          {img && (
            <Image
              src={img}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority={post.id === 1}
            />
          )}

          <div className="card-overlay" />
          <div className="card-highlight" />

          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="card-tag text-[13px] text-white/95 inline-block">
                {post.category}
              </div>
              <h3 className="text-[22px] md:text-[24px] leading-[28px] text-white font-light">
                {post.title}
              </h3>
              <p className="text-[14px] text-white/80 mt-2 mb-4 max-w-[95%]">
                {post.excerpt}
              </p>
            </div>

            <div>
              
            </div>

            <div className="w-full">
              <Link href={`/blog/${post.id}`} className="block w-full">
                <button
                  className="glass-btn w-full rounded-[24px] py-3 text-sm text-white/95"
                  aria-label={`Read more ${post.title}`}
                >
                  READ MORE
                </button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  };

  // guard: ensure at least 6 posts exist (otherwise render gracefully)
  const p = (i: number) => posts[i] ?? null;

  return (
    <section className="w-full bg-[#121819] pt-16 pb-20">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* 3-column grid on large screens; single column below */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1300px] mx-auto">
          {/* LEFT column */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[50px] md:text-[38px] font-light text-white leading-tight">
              {blogsData.sectionTitle || "Insights"}
            </h2>

            {p(0) ? <Card post={p(0)} h="h-[360px]" /> : null}
            {p(1) ? <Card post={p(1)} h="h-[360px]" /> : null}
          </div>

          {/* MIDDLE column */}
          <div className="flex flex-col gap-6">
            {p(2) ? <Card post={p(2)} h="h-[360px]" /> : null}
            {p(3) ? <Card post={p(3)} h="h-[360px]" /> : null}

            {/* DESKTOP CTA: shown only on lg+ */}
            <div className="hidden lg:flex rounded-[16px] p-6 bg-gradient-to-br from-white/6 to-black/10 items-center justify-center">
              <Link href={blogsData.cta?.href || "/blogs"} className="w-full">
                <button className="glass-btn w-full rounded-[24px] py-3 text-sm text-white/95">
                  {blogsData.cta?.label || "View All Blogs"}
                </button>
              </Link>
            </div>
          </div>

          {/* RIGHT column */}
          <div className="flex flex-col gap-6">
            <p className="text-[15px] text-white/70 leading-relaxed max-w-[420px]">
              {blogsData.sectionSubtitle}
            </p>

            {p(4) ? <Card post={p(4)} h="h-[360px]" /> : null}
            {p(5) ? <Card post={p(5)} h="h-[360px]" /> : null}
          </div>

          {/* MOBILE CTA: visible only below lg, placed after the middle column in DOM so it appears in the stacked middle */}
          <div className="lg:hidden rounded-[16px] p-6 bg-gradient-to-br from-white/6 to-black/10 items-center justify-center">
            <Link href={blogsData.cta?.href || "/blogs"} className="w-full">
              <button className="glass-btn w-full rounded-[24px] py-3 text-sm text-white/95">
                  {blogsData.cta?.label || "View All Blogs"}
                </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
