import Navbar from "../components/Navbar";
import Navbar2 from "../components/Navbar-2";
import Link from 'next/link';
import type { Metadata } from "next";
import { type SanityDocument } from "next-sanity";

import { blogClient } from "@/sanity/client";

const POSTS_QUERY = `*[_type == "post" && defined(slug.current) && defined(publishedAt)]
  | order(publishedAt desc)[0...12]{
    _id,
    title,
    slug,
    read,
    publishedAt,
    mainImage {
      asset->{ _id, url },
      alt
    }
  }`;


const options = { next: { revalidate: 30 } };

export const metadata: Metadata = {
  title: "Blog | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};

export default async function Blogs() {
const posts = await blogClient.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
    const isLoggedIn = false;    

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
            {isLoggedIn ? <Navbar /> : <Navbar2 />}
        </div>

        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1 className="text-center">Blog</h1>


          

        {/* Blog row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {posts.map((post) => (

            <div className="flex flex-col w-full bg-white rounded-lg shadow-lg border-2 border-grey-500" key={post._id}>
              <img
                src={post.mainImage?.asset?.url}
                alt={post.mainImage?.alt || post.title}
                className="rounded-t-lg w-full h-[250px] object-cover"
              />

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">{post.title}</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">{new Date(post.publishedAt).toLocaleDateString()}</p> <p>•</p> <p className="text-grey flex">{post.read} min read</p></span>
                    <Link href={`blog/${post.slug.current}`} className="green-link">Read More</Link>
                </div>
            </div>


                  ))}


          </div>
        {/* End of Blog row 1 */}

        </div>
      </div>

       {/* Newsletter */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
        <div className="bg-white flex flex-col items-center w-full lg:w-[900px] min-h-[300px] rounded-2xl py-10 px-6 lg:px-20 mx-4 shadow-lg border-2 border-grey-500">
          <h2 className="sm: text-center mb-2">Unlock Your Growth with Expert Insights</h2>
          <p className="text-center">
            Join our monthly RPBX newsletter for exclusive resources, investor opportunities, and expert advice to fuel your business success. It’s free, insightful, and spam-free!
          </p>
          <input
            type="email"
            placeholder="Email"
            className="mt-5 w-full px-6 py-2 rounded-full font-medium bg-[#EDE2E2]"
          />
          <button className="mt-5 w-full px-6 py-2 rounded-full font-medium transition bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
            Sign In
          </button>
          <p className="mt-5 pt-2 border-t-2 border-[#A1A1A1] text-center">
            By submitting this form, you are consenting to receive marketing emails from: info@rioplexbizx.com. You can revoke your consent to receive emails at any time by using the SafeUnsubscribe® link, found at the bottom of every email. Emails are serviced by Constant Contact
          </p>
        </div>
      </div>

    </div>
  );
}
