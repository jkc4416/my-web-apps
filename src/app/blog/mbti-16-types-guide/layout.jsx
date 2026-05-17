import { POSTS } from "../posts";
const post = POSTS.find((p) => p.slug === "mbti-16-types-guide");

export const metadata = {
  title: `${post.title} | FunAppBox 블로그`,
  description: post.excerpt,
  alternates: { canonical: `https://www.funappbox.com/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.excerpt,
    type: "article",
    publishedTime: post.date,
    url: `https://www.funappbox.com/blog/${post.slug}`,
  },
};

export default function Layout({ children }) {
  return children;
}
