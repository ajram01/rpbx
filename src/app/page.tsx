import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-cover bg-center">
        <div>
          <h1>header will go somewhere in this div</h1>
        </div>
        <div className="flex flex-row">
          <div className="flex-1 flex justify-end items-center p-[15px]">
            <div className="flex flex-col items-center w-[560px]">
              <h1>Unlock Your Business Potential</h1>
              <button>Sign In</button>
              <p>By clicking Continue to join or sign in, you agree to RioPlex’s User Agreement, Privacy Policy, and Cookie Policy.</p>
              <p>New to RioPlex? Join Now</p>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/images/other/home-header.png"
              alt="Investors and Business Owners"
              width={2000}
              height={450}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Div 2: 1 div containing 3 div columns */}
      <div className="bg-[url('/images/backgrounds/black-bg.png')] bg-cover bg-center bg-fixed flex justify-center p-[15px]">
        <div className="flex flex-row gap-x-[15px] w-[1140px] ">
          <div className="bg-white flex-1 min-h-[500px]">Div 2 - Col 1</div>
          <div className="bg-white flex-1 min-h-[500px]">Div 2 - Col 2</div>
          <div className="bg-white flex-1 min-h-[500px]">Div 2 - Col 3</div>
        </div>
      </div>

      {/* Div 3: 3 rows */}
      <div className="flex flex-col items-center bg-[url('/images/backgrounds/white-bg.png')] bg-cover bg-center py-[15px]">

        <div className="flex flex-row gap-x-[15px] ">
          <div className="flex-1 flex justify-end">
            <div className="flex flex-col items-start w-[560px]">
              <h2>Explore our Blog topics</h2>
              <p>RPBX is here to offer you valuable knowledge. We will help guide you in making your next steps.</p>
            </div>
          </div>
          <div className="flex-1 flex justify-start">
            <div className="flex flex-col items-center w-[560px]">
              <button>Selling a Business</button>
              <button>Buying a Business</button>
            </div>
          </div>
        </div>

        
        <div className="flex flex-row gap-x-[15px] w-full">
          <div className="bg-white shadow-md flex-1 flex justify-end">
            <div className="flex flex-col items-start w-[560px]">
              <h2>Who is RPBX for?</h2>
              <p>Connecting small business owners with the right investors to help them grow, succeed, and achieve their goals. Join RioPlex Business Exchange and be part of a platform built for ambitious businesses and forward-thinking investors.</p>
              <button>Looking for an investor</button>
              <button>Looking to invest</button>
            </div>
          </div>
          <div className="flex-1 flex justify-start">
            <div className=" flex flex-col items-center text-center w-[560px]">
              <h2>2.3M Bussineses at stake</h2>
              <p>In the United States, baby boomers own approximately 40% of small businesses, translating to around 2.3 million businesses. As this generation approaches retirement, many companies will be sold or closed. This transition could impact millions of jobs and represent a significant shift in business ownership over the next decade</p>
            </div>
          </div>
        </div>


        <div className="w-[1140px] flex flex-col items-center">
          <h2>Business Solutions</h2>
          <p>Connect with Our Trusted Advisors for Tailored Business Solutions</p>
          <div className="flex flex-row gap-x-[5px] w-full">

            <div className="flex-1 flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-1.png"
                alt="solution-icon-1"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p>Business Evaluation</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-2.png"
                alt="solution-icon-2"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p>Business Evaluation</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-3.png"
                alt="solution-icon-3"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p>Business Evaluation</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-4.png"
                alt="solution-icon-4"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <p>Business Evaluation</p>
            </div>

          </div>
        </div>
      </div>



      {/* Div 4: 1 div */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed p-[15px]">
        <div className="bg-white flex flex-col items-center items-center w-[1140px] min-h-[300px]">
          <h2>Unlock Your Growth with Expert Insights</h2>
          <p>Join our monthly RPBX newsletter for exclusive resources, investor opportunities, and expert advice to fuel your business success. It’s free, insightful, and spam-free!</p>
          <p>Join our monthly RPBX newsletter for exclusive resources, investor opportunities, and expert advice to fuel your business success. It’s free, insightful, and spam-free!</p>
          <button>Join Now</button>
          <p>By submitting this form, you are consenting to receive marketing emails from: info@rioplexbizx.com. You can revoke your consent to receive emails at any time by using the SafeUnsubscribe® link, found at the bottom of every email. Emails are serviced by Constant Contact</p>
        </div>
      </div>
    </div>
  );
}
