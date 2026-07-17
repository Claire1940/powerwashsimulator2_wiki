"use client";

import { useState, Suspense, lazy } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Home,
  Map,
  Rocket,
  Search,
  Sparkles,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.powerwashsimulator2.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "PowerWash Simulator 2 Wiki",
        description:
          "Complete PowerWash Simulator 2 Wiki covering jobs, washers, nozzles, tools, upgrades, achievements, co-op, Home Base, DLC, and updates for the relaxing cleaning simulator.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "PowerWash Simulator 2 - Relaxing Co-op Cleaning Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "PowerWash Simulator 2 Wiki",
        alternateName: "PowerWash Simulator 2",
        url: siteUrl,
        description:
          "Complete PowerWash Simulator 2 Wiki resource hub for jobs, washers, nozzles, tools, upgrades, achievements, co-op, Home Base, and DLC guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "PowerWash Simulator 2 Wiki - Relaxing Co-op Cleaning Simulator",
        },
        sameAs: [
          "https://store.steampowered.com/app/2968420/PowerWash_Simulator_2/",
          "https://discord.com/invite/powerwashsimulator",
          "https://www.reddit.com/r/PowerWashSimulator/",
          "https://www.youtube.com/@FuturLab246",
        ],
      },
      {
        "@type": "VideoGame",
        name: "PowerWash Simulator 2",
        gamePlatform: ["PC", "Steam", "PlayStation 5", "Xbox Series X|S", "Nintendo Switch 2"],
        applicationCategory: "Game",
        genre: ["Simulation", "Casual", "Co-op", "Relaxing"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://store.steampowered.com/app/2968420/PowerWash_Simulator_2/",
        },
      },
      {
        "@type": "VideoObject",
        name: "PowerWash Simulator 2 | Launch Trailer",
        description:
          "Official PowerWash Simulator 2 Launch Trailer from FuturLab, showcasing the relaxing co-op cleaning simulator across PC, PlayStation 5, Xbox Series X|S, and Nintendo Switch 2.",
        uploadDate: "2025-10-23",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/xt6Lkfk_Sg8",
        url: "https://www.youtube.com/watch?v=xt6Lkfk_Sg8",
      },
    ],
  };

  // FAQ accordion state (shared by the Multiplayer module)
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Difficulty badge color (Easy / Moderate / Challenging / Advanced / Hard)
  const difficultyStyle = (d: string) => {
    const dl = (d || "").toLowerCase();
    if (dl.includes("adv") || dl === "hard")
      return "bg-red-500/10 border-red-500/30 text-red-400";
    if (dl.includes("chal"))
      return "bg-orange-500/10 border-orange-500/30 text-orange-400";
    if (dl.includes("mod"))
      return "bg-sky-500/10 border-sky-500/30 text-sky-400";
    return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
  };

  // Equipment tier badge color (S / A / B)
  const tierStyle = (tier: string) => {
    if (tier === "S")
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    if (tier === "A")
      return "bg-sky-500/10 border-sky-500/30 text-sky-400";
    return "bg-slate-500/10 border-slate-500/30 text-slate-400";
  };

  // Release status badge color
  const statusStyle = (s: string) => {
    const sl = (s || "").toLowerCase();
    if (sl.includes("release"))
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    if (sl.includes("announ"))
      return "bg-sky-500/10 border-sky-500/30 text-sky-400";
    return "bg-slate-500/10 border-slate-500/30 text-slate-400";
  };

  // Reusable module header (eyebrow + title + subtitle + intro)
  const ModuleHeader = ({
    eyebrow,
    title,
    subtitle,
    intro,
    icon: Icon,
  }: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    intro?: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 md:mb-5 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
          {subtitle}
        </p>
      )}
      {intro && (
        <p className="text-sm md:text-base text-muted-foreground/80 max-w-3xl mx-auto">
          {intro}
        </p>
      )}
    </div>
  );

  const m = t.modules;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beginner-guide")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/2968420/PowerWash_Simulator_2/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="xt6Lkfk_Sg8"
              title="PowerWash Simulator 2 | Launch Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID（1:1 对应下方 8 个模块）
              const sectionIds = [
                "beginner-guide",
                "jobs-locations",
                "best-equipment",
                "multiplayer",
                "achievements",
                "dlc-updates",
                "last-dirt",
                "home-base",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashBeginnerGuide.eyebrow}
            title={m.powerwashBeginnerGuide.title}
            subtitle={m.powerwashBeginnerGuide.subtitle}
            intro={m.powerwashBeginnerGuide.intro}
            icon={BookOpen}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {m.powerwashBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 md:flex-col md:items-center">
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step ?? index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <div className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-[hsl(var(--nav-theme-light))]">
                        Quick Tip:{" "}
                      </span>
                      {step.quickTip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Jobs and Locations */}
      <section
        id="jobs-locations"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashJobsAndLocations.eyebrow}
            title={m.powerwashJobsAndLocations.title}
            subtitle={m.powerwashJobsAndLocations.subtitle}
            intro={m.powerwashJobsAndLocations.intro}
            icon={Map}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {m.powerwashJobsAndLocations.jobs.map((job: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                    {job.unlockOrder}
                  </span>
                  <h3 className="font-bold text-base md:text-lg leading-tight">
                    {job.job}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-[hsl(var(--nav-theme-light))] font-medium mb-2">
                  {job.location}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {job.jobType}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${difficultyStyle(
                      job.difficulty,
                    )}`}
                  >
                    {job.difficulty}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1.5">
                  <span className="font-semibold text-foreground/80">
                    Equipment:{" "}
                  </span>
                  {job.equipment}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground/80">
                  {job.notableDetail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Best Equipment */}
      <section
        id="best-equipment"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashBestEquipment.eyebrow}
            title={m.powerwashBestEquipment.title}
            subtitle={m.powerwashBestEquipment.subtitle}
            intro={m.powerwashBestEquipment.intro}
            icon={Wrench}
          />

          <div className="scroll-reveal space-y-8 md:space-y-10">
            {m.powerwashBestEquipment.tiers.map((tier: any, ti: number) => (
              <div key={ti}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-lg border ${tierStyle(
                      tier.tier,
                    )}`}
                  >
                    Tier {tier.tier}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold">{tier.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {tier.items.map((item: any, ii: number) => (
                    <div
                      key={ii}
                      className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-base md:text-lg leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex-shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Speed
                          </p>
                          <p className="text-xs font-semibold">
                            {item.cleaningSpeed}
                          </p>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Range
                          </p>
                          <p className="text-xs font-semibold">{item.range}</p>
                        </div>
                        <div className="p-1.5 rounded-lg bg-white/5">
                          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Early Value
                          </p>
                          <p className="text-xs font-semibold">
                            {item.earlyGameValue}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        <span className="font-semibold text-foreground/80">
                          Best for:{" "}
                        </span>
                        {item.bestFor}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground/80">
                        {item.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 模块之间的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 4: Multiplayer */}
      <section
        id="multiplayer"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashMultiplayer.eyebrow}
            title={m.powerwashMultiplayer.title}
            subtitle={m.powerwashMultiplayer.subtitle}
            intro={m.powerwashMultiplayer.intro}
            icon={Users}
          />

          <div className="scroll-reveal space-y-2">
            {m.powerwashMultiplayer.faqs.map((faq: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-white/5"
              >
                <button
                  onClick={() =>
                    setFaqExpanded(faqExpanded === index ? null : index)
                  }
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm md:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {faqExpanded === index && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 text-muted-foreground text-sm md:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Achievements */}
      <section
        id="achievements"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashAchievements.eyebrow}
            title={m.powerwashAchievements.title}
            subtitle={m.powerwashAchievements.subtitle}
            intro={m.powerwashAchievements.intro}
            icon={Trophy}
          />

          <div className="scroll-reveal space-y-6 md:space-y-8">
            {m.powerwashAchievements.packs.map((pack: any, pi: number) => (
              <div key={pi}>
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="text-lg md:text-xl font-bold">{pack.pack}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {pack.count} Achievements
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {pack.entries.map((a: any, ai: number) => (
                    <div
                      key={ai}
                      className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-sm md:text-base text-[hsl(var(--nav-theme-light))] leading-tight">
                          {a.achievement}
                        </h4>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${difficultyStyle(
                            a.difficulty,
                          )}`}
                        >
                          {a.difficulty}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mb-1.5">
                        {a.requirement}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mb-1.5">
                        <span className="font-semibold text-foreground/70">
                          Related job:{" "}
                        </span>
                        {a.job}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground/80 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>
                          <span className="font-semibold text-foreground/70">
                            How to get:{" "}
                          </span>
                          {a.guide}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 6: DLC and Updates */}
      <section
        id="dlc-updates"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashDlcAndUpdates.eyebrow}
            title={m.powerwashDlcAndUpdates.title}
            subtitle={m.powerwashDlcAndUpdates.subtitle}
            intro={m.powerwashDlcAndUpdates.intro}
            icon={Rocket}
          />

          <div className="scroll-reveal relative pl-6 md:pl-8 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6 md:space-y-8">
            {m.powerwashDlcAndUpdates.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] md:-left-[1.7rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${statusStyle(
                        entry.status,
                      )}`}
                    >
                      {entry.status}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {entry.type}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-base md:text-lg mb-1">
                    {entry.release}
                  </h3>
                  {entry.price && (
                    <p className="text-sm text-[hsl(var(--nav-theme-light))] font-medium mb-2">
                      {entry.price}
                    </p>
                  )}
                  {entry.jobs && entry.jobs.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {entry.jobs.map((j: string, ji: number) => (
                        <span
                          key={ji}
                          className="text-xs px-2 py-0.5 rounded bg-white/5 border border-border"
                        >
                          {j}
                        </span>
                      ))}
                    </div>
                  )}
                  {entry.highlights && entry.highlights.length > 0 && (
                    <ul className="space-y-1.5">
                      {entry.highlights.map((h: string, hi: number) => (
                        <li
                          key={hi}
                          className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground"
                        >
                          <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Last Dirt Guide */}
      <section
        id="last-dirt"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashLastDirtGuide.eyebrow}
            title={m.powerwashLastDirtGuide.title}
            subtitle={m.powerwashLastDirtGuide.subtitle}
            intro={m.powerwashLastDirtGuide.intro}
            icon={Search}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {m.powerwashLastDirtGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-sm md:text-base font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step ?? index + 1}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold">{step.title}</h3>
                </div>
                <p className="text-sm md:text-base text-muted-foreground mb-3">
                  {step.action}
                </p>
                <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-yellow-400/80" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-yellow-400/80">
                      Common Misses
                    </span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
                    {step.commonMisses.map((miss: string, mi: number) => (
                      <li
                        key={mi}
                        className="flex items-start gap-1.5 text-xs md:text-sm text-muted-foreground"
                      >
                        <span className="text-yellow-400/60 mt-0.5 flex-shrink-0">
                          •
                        </span>
                        <span>{miss}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 7: 模块之间的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 8: Home Base and Collectibles */}
      <section
        id="home-base"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={m.powerwashHomeBase.eyebrow}
            title={m.powerwashHomeBase.title}
            subtitle={m.powerwashHomeBase.subtitle}
            intro={m.powerwashHomeBase.intro}
            icon={Home}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {m.powerwashHomeBase.items.map((item: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                    <h3 className="font-bold text-base md:text-lg leading-tight">
                      {item.item}
                    </h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex-shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-3">
                  {item.howToGetOrUse}
                </p>
                {item.checklist && item.checklist.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {item.checklist.map((c: string, ci: number) => (
                      <li
                        key={ci}
                        className="flex items-start gap-1.5 text-xs md:text-sm text-muted-foreground"
                      >
                        <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  {item.achievement && item.achievement !== "None" && (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Trophy className="w-3 h-3" />
                      {item.achievement}
                    </span>
                  )}
                  {item.reward && (
                    <span className="text-xs text-muted-foreground/80 px-2 py-1">
                      {item.reward}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/powerwashsimulator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/PowerWashSim"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/2968420"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/2968420/PowerWash_Simulator_2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
