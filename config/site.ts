export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "AnimeDen",
  description:
    "AnimeDen is a free and ad-free anime streaming app.",
  mainNav: [
    {
      title: "Home",
      href: "/home",
    },
    {
      title: "Trending",
      href: "/trending",
    },
    {
      title: "Popular",
      href: "/popular",
    },
  ],
  links: {
    github: "https://github.com/sinnedpenguin/animeden",
    discord: "https://discord.gg/Gcch3jSrYt"
  },
}
