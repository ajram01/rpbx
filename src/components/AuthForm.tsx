export default function AuthForm() {
  return (
    <>
      <input
        type="email"
        placeholder="Email"
        className="mt-5 w-full px-6 py-2 rounded-full font-medium bg-white border border-slate-200 focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] focus:ring-1 outline-none transition"
      />
      <button className="mt-5 w-full px-6 py-2 rounded-full font-medium transition bg-white hover:bg-[var(--color-primary)] text-black border  border-slate-200 hover:text-white">
        Sign In
      </button>

      <p className="mt-5 text-center">
        By clicking Continue to join or sign in, you agree to RioPlex’s User Agreement, Privacy Policy, and Cookie Policy.
      </p>
      <p className="mt-5 text-center">New to RioPlex? Join Now</p>
    </>
  );
}
