import { getAllPosts } from "@/lib/posts";
import SynexHeroClient from "./SynexHeroClient";

export default function SynexHeroPage() {
  const allPosts = getAllPosts();
  return <SynexHeroClient allPosts={allPosts} />;
}
