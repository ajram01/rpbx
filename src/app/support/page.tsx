'use client'; // Needed for state in Next.js 13+ app directory

import Navbar from "../components/Navbar";
import Navbar2 from "../components/Navbar-2";
import Accordion from '../../components/ui/accordion';
import Link from 'next/link';

export default function Support() {
    const isLoggedIn = false;    

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
            {isLoggedIn ? <Navbar /> : <Navbar2 />}
        </div>

        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1>Support</h1>
          <p className="-mt-2">We’re here to help. Below you’ll find answers to common support topics and how to get in touch with us.</p>

          {/* Accordion Section */}
          <div className="gap-5 flex flex-col">

            <Accordion title="How do I contact RioPlex Business Exchange support?">
              <p>
                You can reach our support team by filling out the contact form on our website or emailing us directly at{" "}
                <Link href="mailto:info@rgvisionmedia.com" className="green-link">info@rgvisionmedia.com</Link>.  
                Our office is located at 100 E. Nolana Ave. Suite 130, McAllen, TX 78504.
              </p>
            </Accordion>

            <Accordion title="I’m having trouble logging into my account. What should I do?">
              <p>
                If you can’t access your account, first try resetting your password from the login page. 
                If the issue persists, contact our support team with the email address associated with your account so we can assist you further.
              </p>
            </Accordion>

            <Accordion title="How do I update my membership or billing information?">
              <p>
                You can manage your membership and billing information from your account settings. 
                If you experience any issues updating payment details or renewing your subscription, contact our support team for assistance.
              </p>
            </Accordion>

            <Accordion title="What should I do if I encounter technical issues on the platform?">
              <p>
                If you run into bugs, errors, or performance issues, please report them through the contact form or email us with details 
                (screenshots, browser type, device info, and steps to reproduce the problem). 
                This will help our team resolve the issue faster.
              </p>
            </Accordion>

            <Accordion title="Can I speak with someone directly?">
              <p>
                Our primary support channel is email, which ensures we can track and respond efficiently. 
                However, if your issue requires direct communication, we can schedule a call with one of our support specialists.
              </p>
            </Accordion>

            <Accordion title="Contact Information">
              <p>
                If you have any questions, please contact us at:
              </p>
              <p>
                Phone: (956) 322-5942<br />
                Email: <Link href="mailto:info@rioplexbizx.com" className="green-link">info@rioplexbizx.com</Link><br />
                Mailing Address: 100 E. Nolana Ave. Suite 130 McAllen, TX 78504
              </p>
            </Accordion>

          </div>

        </div>
      </div>
    </div>
  );
}
