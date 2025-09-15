import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { eventClient } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Navbar2 from "../../components/Navbar-2";


interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const POST_QUERY = `*[
  _type == "event" && slug.current == $slug
][0]{
  _id,
  title,
  slug,
  hosts,
  location,
  information,
  date,
  image {
    asset->{
      _id,
      url
    },
    alt
  }
}`;


const { projectId, dataset } = eventClient.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await eventClient.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );

  if (!post) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link href="/events" className="green-link hover:underline">
          ← Back to events
        </Link>
      </div>
    );
  }

  const postImageUrl = post.image?.asset?.url
    ? urlFor(post.image)?.width(1200).url()
    : null;

  const isLoggedIn = false;

  // Format date/time
  const eventDate = post.date ? new Date(post.date) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
      <div>{isLoggedIn ? <Navbar /> : <Navbar2 />}</div>

      <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
        <h1 className="text-4xl font-bold">{post.title}</h1>

        {postImageUrl && (
          <img
            src={postImageUrl}
            alt={post.image?.alt || post.title}
            className="w-full h-auto rounded-xl"
          />
        )}

        {/* Event Meta styled like Published section */}
        <span className="flex flex-row gap-3 flex-wrap items-center text-grey mt-3">
          {formattedDate && (
            <span className="flex items-center gap-1">
              <Image
                src="/images/icons/calendar.png"
                alt="Date"
                width={16}
                height={16}
              />
              <p>{formattedDate}</p>
            </span>
          )}

          {formattedTime && (
            <>
              <p>•</p>
              <span className="flex items-center gap-1">
                <Image
                  src="/images/icons/clock.png"
                  alt="Time"
                  width={16}
                  height={16}
                />
                <p>{formattedTime}</p>
              </span>
            </>
          )}

          {post.hosts && (
            <>
              <p>•</p>
              <span className="flex items-center gap-1">
                <Image
                  src="/images/icons/user.png"
                  alt="Host"
                  width={16}
                  height={16}
                />
                <p>
                  {Array.isArray(post.hosts)
                    ? post.hosts.join(", ")
                    : post.hosts}
                </p>
              </span>
            </>
          )}

          {post.location && (
            <>
              <p>•</p>
              <span className="flex items-center gap-1">
                <Image
                  src="/images/icons/location.png"
                  alt="Location"
                  width={16}
                  height={16}
                />
                <p>{post.location}</p>
              </span>
            </>
          )}
        </span>

        <div className="border-t border-gray-400 my-5"></div>

<div className="prose">
  {post.information && <p>{post.information}</p>}
</div>



        <Link href="/events" className="green-link hover:underline">
          ← Back to events
        </Link>
      </div>

      {/* Newsletter */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
        <div className="bg-white flex flex-col items-center w-full lg:w-[900px] min-h-[300px] rounded-2xl py-10 px-6 lg:px-20 mx-4 shadow-lg border-2 border-grey-500">
          <h2 className="sm: text-center mb-2">
            Unlock Your Growth with Expert Insights
          </h2>
          <p className="text-center">
            Join our monthly RPBX newsletter for exclusive resources, investor
            opportunities, and expert advice to fuel your business success.
            It’s free, insightful, and spam-free!
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
            By submitting this form, you are consenting to receive marketing
            emails from: info@rioplexbizx.com. You can revoke your consent to
            receive emails at any time by using the SafeUnsubscribe® link, found
            at the bottom of every email. Emails are serviced by Constant
            Contact
          </p>
        </div>
      </div>
    </div>
  );
}
