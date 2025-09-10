import Navbar from "../../components/Navbar-2";
import Button from "../../components/Button";
import Image from 'next/image';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Listing | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};

export default async function Businesses() {
  return (
    <div>
      {/* Background and Navbar */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top min-h-screen">
        <Navbar />

        {/* Content Wrapper */}
        <div className="w-full lg:w-[1140px] mx-auto py-10 px-5 lg:px-0 flex flex-col lg:flex-row gap-5">
            <div className="w-full lg:w-1/3">
                <div className="flex flex-col ">
                    <Image
                    src="/images/test/chen-lee.png"
                    alt="Investor"
                    className="w-full object-cover rounded-t-lg shadow-lg"
                    width={300}
                    height={200}
                    />
                </div>
                <div className="bg-[#272827] p-5 rounded-b-lg shadow-lg">
                    <p className="font-semibold text-white">Organization/Entity</p>
                    <p className="text-white">RGVision Media</p>

                    <div className="border-t-1 border-grey-500 my-5"></div>

                    <p className="font-semibold text-white">Email</p>
                    <p className="text-white">b.martin@raymondjames.com</p>
                    <Button className="w-full mt-5">Contact</Button>
                </div>
            </div>
            <div className="w-full lg:w-2/3 lg:pr-10 gap-5 flex flex-col">
                <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border p-6 lg:p-8">
                    <h1 className="pb-2">Chen Lee</h1>
                    <p>Marketing | 25+ years of experience</p>
                    <div className="border-t-1 border-gray-400 my-5"></div>
                    <p><b>About Me: </b> I am a wealth advisor helping business owners with exit planning and looking to organically build assets through acquisition.</p>
                </div>
                <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border p-6 lg:p-8">
                    <h2 className="pb-2">Capital Criteria</h2>
                    <p><b>City:</b> Mcallen</p>
                    <p><b>Investment Interest:</b> Finance</p>
                    <p><b>Additional Investment Interests:</b> Real Estate, Media, Tech</p>
                    <p><b>% Of Ownership Looking For:</b> 100%</p>
                    <div className="border-t-1 border-gray-400 my-5"></div>
                    <p><b>Company EBITDA Looking For:</b> 500k</p>
                    <p><b>Business Cash Flow:</b> 800k+</p>
                    <p><b>Annual Net Worth:</b> 3-5 Million</p>
                </div>
            </div>
        </div>


      </div>
    </div>
  );
}
