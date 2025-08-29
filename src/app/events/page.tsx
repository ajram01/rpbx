import Navbar from "../components/Navbar";
import Navbar2 from "../components/Navbar-2";
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};

export default function Events() {
    const isLoggedIn = false;    

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
            {isLoggedIn ? <Navbar /> : <Navbar2 />}
        </div>

        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1 className="text-center">Events</h1>

          {/* Accordion Section */}
          <div className="gap-5 flex flex-col">
            <div className="bg-white rounded-lg shadow-lg border-2 border-grey-500 flex flex-col lg:flex-row gap-5">
                <div className="flex min-w-1/4">
                <Image
                  src="/images/test/event-image.png"
                  alt="Investor Avatar"
                  className="rounded-l-lg w-full"
                  width={200}
                  height={100}
                />
                </div>

                <div className="flex flex-col p-5 gap-2">
                       <div className="flex items-center mt-3  mb-3">
                            <div className="flex items-center mr-4">
                            <Image
                            src="/images/icons/calendar.png"
                            alt="Location"
                            className="min-w-4 min-h-4  mr-2"
                            width={16}
                            height={16}
                            />
                            <p>Dex. 23 2024</p>
                            </div>

                            <div className="flex items-center mr-4">
                            <Image
                            src="/images/icons/clock.png"
                            alt="Location"
                            className="min-w-4 min-h-4  mr-2"
                            width={16}
                            height={16}
                            />
                            <p>5:00 PM</p>
                            </div>

                            <div className="flex items-center mr-4">
                            <Image
                            src="/images/icons/user.png"
                            alt="Location"
                            className="min-w-5 min-h-4 mr-2"
                            width={16}
                            height={16}
                            />
                            <p>Gabriel Puente</p>
                            </div>

                            <div className="flex items-center mr-4">
                            <Image
                            src="/images/icons/location.png"
                            alt="Location"
                            className="min-w-4 min-h-4 mr-2"
                            width={16}
                            height={16}
                            />
                            <p>RGVision Media</p>
                            </div>
                       </div>

                <h4 className="large">Business Conference</h4>
                <p className="text-grey">The Business Value Mastery Conference is a must-attend event for business owners looking to understand how their business is evaluated and how to increase its worth. Learn from industry experts as they share key insights into the factors that drive business value, along with actionable strategies to enhance profitability, streamline operations, and attract investors.</p>
               <Link href="/" className="green-link">Read More</Link>
                </div>

                

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
