import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login"],
      disallow: [
        "/api/",
        "/admin/",
        "/idp/",
        "/profile/",
        "/team-approvals/",
        "/guide",
      ],
    },
    sitemap: "https://idp.fisheries.go.th/sitemap.xml",
  };
}
