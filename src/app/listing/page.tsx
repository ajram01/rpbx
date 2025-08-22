import Navbar from "../components/Navbar-2";
import Button from "../components/Button";
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
        <div className="w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">

          <div className="bg-white rounded-lg shadow-lg overflow-hidden border p-6 lg:p-10">
            <h1 className="text-2xl lg:text-3xl font-bold text-left pb-5">Home Services</h1>

            {/* Responsive Layout */}
            <div className="flex flex-col lg:flex-row gap-5">
              
              {/* Left Section */}
              <div className="flex flex-col w-full lg:w-2/3">
                <Image
                  src="/images/businesses/home-services.jpg"
                  alt="Business"
                  className="w-full object-cover rounded-lg mb-5"
                  width={300}
                  height={200}
                />
                <p className="text-sm lg:text-base leading-relaxed">
                  AAA Plumbing McAllen has been serving the Rio Grande Valley since March 2001. 
                  We originally operated under the name McAllen Plumbing for seven years before 
                  rebranding to AAA Plumbing to expand our services to the Harlingen, TX area. 
                  From 2001 to 2016, we maintained a strong presence through full-page advertising 
                  in local phone books and built a loyal customer base. From 2017 to 2025, we continued 
                  serving the community primarily through repeat and referral business. In 2024 alone, 
                  we completed 150 jobs totaling $140,625 in revenue, with an average job value of $937. 
                  In April 2025, we partnered with BizEquity—the world’s largest business valuation 
                  provider—and submitted our financial summaries for 2022, 2023, and 2024. Based on this 
                  data, the business was valued at $242,748. This valuation includes a fully stocked van 
                  and a secondary service vehicle equipped with tools for drain cleaning, sewer camera 
                  inspections, sewer locating, and more. Give us a call at 956-648-1036 and ask for Mr. 
                  Leyva. Visit our website to learn more: aaaplumbingmcallen.com
                </p>
              </div>

              {/* Right Section */}
              <div className="flex flex-col w-full lg:w-1/3">
                {[
                  { label: "Annual Revenue", value: "100K - 250K" },
                  { label: "Company EBITDA", value: "50k - 100k" },
                  { label: "Years in Business", value: "20+ years" },
                  { label: "Location", value: "Cameron County, Hidalgo County" },
                  { label: "Will you be able to provide three years of Financial Documents upon request?", value: "Yes" },
                  { label: "Will you be able to provide three years of Tax Returns upon request?", value: "Yes" }
                ].map((item, i) => (
                  <div key={i} className="mb-5 p-5 bg-[#f5f5f5] rounded-lg text-center">
                    <p className="font-semibold">{item.label}</p>
                    <p>{item.value}</p>
                  </div>
                ))}
                <Button className="w-full">Contact</Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
