import Image from "next/image";
import NavGate from "../components/NavGate";
import Button from "../components/Button";
import AuthForm from "../../components/AuthForm";
import VideoSection from "../components/VideoSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Investor Accounts | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};



export default async function Investor() {

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center">
        <div>
          <NavGate />
        </div>

        {/* Buy A Business */}
        <div className="flex flex-col lg:flex-row py-10 lg:py-0">
          <div className="flex-1 flex justify-center lg:justify-end items-center px-4 lg:p-[15px] order-2 lg:order-1">
            <div className="flex flex-col items-center w-full lg:w-[560px] max-w-lg">
              <h1 className="text-center">Discover Opportunities. <br />  Invest in tomorrow.</h1>

              <AuthForm />
            </div>
          </div>

          <div className="flex-1 lg:order-2 hidden lg:block">
            <Image
              src="/images/header/investor-header.png"
              alt="Investors and Business Owners"
              width={2000}
              height={450}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Div 2: How It Works */}
      <div className="bg-[url('/images/backgrounds/black-bg.png')] bg-cover bg-center bg-fixed lg:bg-fixed flex justify-center py-10">
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:gap-x-10 w-full lg:w-[1140px] px-4 lg:px-0">

          <div className="flex-1 flex flex-col">
            <h2 className="text-white">How It Works</h2>

            <div className="flex flex-col gap-6 mt-10">
              <div className="flex flex-row">
                <div className="flex items-center justify-center min-w-12 max-h-12 bg-[#61BD9C] rounded-full mr-4">
                  <h4 className="text-white">1</h4>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white">Select Your Package</h4>
                  <p className="text-white pt-2">Choose to advertise your business and subscribe monthly, or save 20% when you subscribe annually.</p>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex items-center justify-center min-w-12 max-h-12 bg-[#61BD9C] rounded-full mr-4">
                  <h4 className="text-white">2</h4>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white">Create Your Listing</h4>
                  <p className="text-white pt-2">Add as much information as you like, including photos and other documents, in our easy to use listing builder.</p>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex items-center justify-center min-w-12 max-h-12 bg-[#61BD9C] rounded-full mr-4">
                  <h4 className="text-white">3</h4>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white">Review Your Interested Buyers</h4>
                  <p className="text-white pt-2">Buyers will contact you directly through the information you input on your listing.</p>
                </div>
              </div>
            </div>
  
          </div>

          <div className="bg-white flex-1 flex flex-col items-center rounded-2xl p-5">
  
          </div>

        </div>
      </div>

      {/* Div 3: As An Investor */}
      <div className="flex flex-col items-center bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top py-[15px]">

        <div className="w-full px-4 lg:w-[1140px] lg:px-0 mx-auto flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 lg:gap-x-10 py-10">

          <div className="flex-1 flex flex-col items-center rounded-2xl">
              <Image
              src="/images/other/investor-mockup.png"
              alt="Investors Feed"
              width={2000}
              height={450}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h3>As An Investor</h3>
            <p className="py-5">Discover vetted businesses aligned with your investment goals through our easy-to-use platform. Filter listings by industry, size, and location, and connect directly with business owners—all in one secure, streamlined dashboard.</p>
            <Button className="max-w-40">Get Started</Button>
          </div>

        </div>
      </div>

      {/* Div 4: video */}
      <VideoSection videoUrl="https://www.youtube.com/embed/ZRSDJQO8ggA" />
    </div>
  );
}
