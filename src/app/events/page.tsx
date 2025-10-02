import NavGate from '../components/NavGate';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from "next";
import { type SanityDocument } from "next-sanity";
import NewsletterSignup from "../../components/ui/newsletter";
import { eventClient } from "@/sanity/client";

const POSTS_QUERY = `*[
  _type == "event"
  && defined(slug.current)
]|order(date desc)[0...12]{
  _id, 
  title, 
  slug, 
  hosts, 
  location, 
  summary, 
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

const options = { next: { revalidate: 30 } };

export const metadata: Metadata = {
  title: "Events | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};

export default async function Events() {
  const events = await eventClient.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <div>
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
          <NavGate />
        </div>

        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1 className="text-center">Events</h1>

          <div className="gap-5 flex flex-col">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

              return (
                <div key={event._id} className="bg-white rounded-lg shadow-lg border-2 border-grey-500 flex flex-col lg:flex-row gap-5">
                  
                  {/* Event Image */}
                  <div className="flex min-w-1/4">
              <img
                src={event.image?.asset?.url}
                alt={event.image?.alt || event.title}
                className="rounded-l-lg lg:rounded-l-lg w-full lg:w-[300px] h-[250px] lg:h-auto object-cover"
              />
                  </div>

                  <div className="flex flex-col p-5 gap-2">

                    {/* Event Meta */}
                    <div className="flex items-center mt-3 mb-3 flex-wrap gap-4">
                      
                      <div className="flex items-center">
                        <Image
                          src="/images/icons/calendar.png"
                          alt="Date"
                          className="min-w-4 min-h-4 mr-2"
                          width={16}
                          height={16}
                        />
                        <p>{formattedDate}</p>
                      </div>

                      <div className="flex items-center">
                        <Image
                          src="/images/icons/clock.png"
                          alt="Time"
                          className="min-w-4 min-h-4 mr-2"
                          width={16}
                          height={16}
                        />
                        <p>{formattedTime}</p>
                      </div>

                      {event.hosts && (
                        <div className="flex items-center">
                          <Image
                            src="/images/icons/user.png"
                            alt="Host"
                            className="min-w-5 min-h-4 mr-2"
                            width={16}
                            height={16}
                          />
                          <p>{Array.isArray(event.hosts) ? event.hosts.join(', ') : event.hosts}</p>
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center">
                          <Image
                            src="/images/icons/location.png"
                            alt="Location"
                            className="min-w-4 min-h-4 mr-2"
                            width={16}
                            height={16}
                          />
                          <p>{event.location}</p>
                        </div>
                      )}

                    </div>

                    {/* Event Title & Summary */}
                    <h4 className="large">{event.title}</h4>
                    <p className="text-grey">{event.summary}</p>

                    {/* Link to event details */}
                    {event.slug?.current && (
                      <Link href={`/events/${event.slug.current}`} className="green-link">
                        Read More
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <NewsletterSignup />
    </div>
  );
}
