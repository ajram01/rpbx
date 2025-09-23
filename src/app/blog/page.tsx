// app/blog/page.tsx
import Navbar from "../components/Navbar";
import Navbar2 from "../components/Navbar-2";
import NewsletterSignup from "../../components/ui/newsletter";
import BlogList from "../components/BlogList";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors",
};

<<<<<<< HEAD
export default function Blogs() {
  const isLoggedIn = false;
=======
export default async function Blogs() {
const posts = await blogClient.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
    const isLoggedIn = true;    
>>>>>>> 63c938d (Created the first step of an investor listing themselves on the platform, I also started work oin second step, the preference step)

  return (
    <div>
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>{isLoggedIn ? <Navbar /> : <Navbar2 />}</div>

        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1 className="text-center">Blog</h1>

          {/* filter/sort/fetch */}
          <Suspense fallback={<div>Loading blogs...</div>}>
            <BlogList />
          </Suspense>
        </div>
      </div>

      <NewsletterSignup />
    </div>
  );
}
