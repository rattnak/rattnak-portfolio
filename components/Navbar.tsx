// components/Navbar.tsx
import { hasPublishedBlogPosts } from "@/lib/database";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const showBlog = await hasPublishedBlogPosts();

  return <NavbarClient showBlog={showBlog} />;
}
