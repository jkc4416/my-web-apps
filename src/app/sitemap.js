const BASE_URL = "https://www.funappbox.com";

const routes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/name-test", priority: 0.9, changeFrequency: "monthly" },
  { path: "/calculator", priority: 0.9, changeFrequency: "monthly" },
  { path: "/mbti", priority: 0.9, changeFrequency: "monthly" },
  { path: "/spelling", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sound", priority: 0.8, changeFrequency: "monthly" },
  { path: "/invest", priority: 0.8, changeFrequency: "monthly" },
  { path: "/color", priority: 0.8, changeFrequency: "monthly" },
  { path: "/typing", priority: 0.8, changeFrequency: "monthly" },
  { path: "/menu", priority: 0.8, changeFrequency: "monthly" },
  { path: "/dday", priority: 0.8, changeFrequency: "monthly" },
  { path: "/snake", priority: 0.7, changeFrequency: "monthly" },
  { path: "/flappy", priority: 0.7, changeFrequency: "monthly" },
  { path: "/hamster", priority: 0.8, changeFrequency: "monthly" },
  { path: "/fortune", priority: 0.9, changeFrequency: "daily" },
];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: "2026-04-14",
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
