import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { blogClient } from "@/sanity/client";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Navbar2 from "../../components/Navbar-2";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  publishedAt,
  body,
  mainImage {
    asset->{
      _id,
      url
    },
    alt
  }
}`;

const { projectId, dataset } = blogClient.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({ params }: PostPageProps) {

  const { slug } = await params;

  const post = await blogClient.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );

  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(1200).url()
    : null;

    const isLoggedIn = false;  
  return (

      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
            {isLoggedIn ? <Navbar /> : <Navbar2 />}
        </div>


    
    <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">

      <h1 className="text-4xl font-bold">{post.title}</h1>

      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.mainImage?.alt || post.title}
          className="w-full h-auto rounded-xl "
        />
      )}

      <div className="prose">
        <span className="flex flex-row gap-3"><p className="text-grey flex">Published: {new Date(post.publishedAt).toLocaleDateString()}</p> <p>•</p> <p className="text-grey flex">3 min read</p></span>
        <div className="border-t-1 border-gray-400 my-5"></div>
            {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>

      <Link href="/blog" className="green-link hover:underline">
        ← Back to posts
      </Link>

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
