import Link from 'next/link';

export default function AuthForm() {
  return (
    <>
      <input
        type="email"
        placeholder="Email"
        className="mt-5 w-full px-6 py-2 rounded-full font-medium bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
      />
      <button className="mt-5 w-full px-6 py-2 rounded-full font-medium transition bg-white hover:bg-[var(--color-primary)] text-black hover:text-white border border-gray-300 hover:border-transparent">
        Sign In
      </button>

      <p className="mt-5 text-center">
        By clicking Continue to join or sign in, you agree to RioPlex’s <Link href="/terms" className="hover:underline">Terms of Service</Link>, <Link href="/privacy" className="hover:underline">Privacy Policy</Link>, and <Link href="/cookies" className="hover:underline">Cookie Policy</Link>.
      </p>
      <p className="mt-5 text-center">New to RioPlex? <Link href="/pricing" className="green-link">Join Now</Link></p>
    </>
  );
}
