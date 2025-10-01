export default function NewsletterSignup() {
  return (
    <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
      <div className="bg-white flex flex-col items-center w-full lg:w-[900px] min-h-[300px] rounded-2xl py-10 px-6 lg:px-20 mx-4 shadow-lg border-2 border-grey-500">
        <h2 className="sm: text-center mb-2">Unlock Your Growth with Expert Insights</h2>
        <p className="text-center">
          Join our monthly RPBX newsletter for exclusive resources, investor opportunities, and expert advice to fuel your business success. It’s free, insightful, and spam-free!
        </p>
        <input
          type="email"
          placeholder="Email"
          className="mt-5 w-full px-6 py-2 rounded-full font-medium bg-[#EDE2E2]"
        />
        <button className="mt-5 w-full px-6 py-2 rounded-full font-medium transition bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
          Sign Up
        </button>
        <p className="mt-5 pt-2 border-t-2 border-[#A1A1A1] text-center small text-grey">
          By submitting this form, you are consenting to receive marketing emails from: info@rioplexbizx.com. You can revoke your consent to receive emails at any time by using the SafeUnsubscribe® link, found at the bottom of every email. Emails are serviced by Constant Contact.
        </p>
      </div>
    </div>
  );
}
