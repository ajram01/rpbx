import { LoginForm } from "../components/login-form"
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-[url('/images/backgrounds/white-bg.png')] bg-cover bg-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logos/Rio-Plex-Logo-Main-Mint-&-Charcoal.png"
              width={150}
              height={200}
              alt="RioPlex logo"
              className="h-auto w-[150px]"
              priority
            />
          </Link>
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
