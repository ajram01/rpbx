"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <div>
    <div className="bg-[url('/images/backgrounds/footer-bg.png')] bg-cover bg-center flex justify-center py-10">
      <div className="w-[1140px]">
        <p className="text-white">Follow us on</p>
        <div className="flex justify-left gap-4 mt-2">
          <Link href="https://www.facebook.com/RioPlexBizX" target="_blank">
            <Image src="/images/icons/facebook.png" alt="Facebook" width={24} height={24} />
          </Link>
          <Link href="https://www.instagram.com/rioplexbizx/" target="_blank">
            <Image src="/images/icons/instagram.png" alt="Instagram" width={24} height={24} />
          </Link>
          <Link href="https://www.linkedin.com/company/rioplexbizx/" target="_blank">
            <Image src="/images/icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
          </Link>
        </div>

        <div className="mt-5 pt-4 flex flex-wrap gap-x-15 text-white border-t-2 border-white">
        <Link href="/">Terms of service</Link>
        <Link href="/">Privacy Policy</Link>
        <Link href="/">Cookie Policy</Link>
        <Link href="/">User Agreement</Link>
        <Link href="/">Support</Link>
        <Link href="/">Languages</Link>
        </div>


        <div className="mt-10 flex items-center justify-between">
        <div>
            <p className="text-white">(956) 322-5942</p>
            <p className="text-white">info@rioplexbizx.com</p>
            <p className="text-white">100 E Nolana Ave Suite #130, McAllen, TX 78504</p>
        </div>

        <Image
            src="/images/logos/Rio-Plex-Logo-Main-White.png"
            alt="Footer Logo"
            width={150}
            height={50}
            className="object-contain"
        />
        </div>

      </div>
      </div>
      <div className="text-center bg-white py-2">
        <p className="black">Website by <Link href="https://www.rgvisionmedia.com" target="_blank">RGVision Media</Link></p>
      </div>


    </div>
  );
}
