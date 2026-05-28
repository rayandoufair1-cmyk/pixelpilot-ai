import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata = { title: "Refund Policy — PixelPilot AI" };

export default function RefundsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Refund Policy</h1>
          <p className="text-slate-400 text-sm mb-10">Last updated: June 2025</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Our Commitment</h2>
              <p>We stand behind the quality of our AI-generated websites. If you are not satisfied, we want to make it right.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Before Generation Begins</h2>
              <p>If you request a cancellation before we have begun generating your website, you are eligible for a full refund. Contact us within 2 hours of payment at <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">hello@pixelpilot.ai</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">After Generation</h2>
              <p>Once your website has been generated and delivered to your portal, we do not offer refunds. However, we will work with you through our revision process to ensure you are happy with the result. Use the portal chat to request any changes within your plan's revision allowance.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Exceptions</h2>
              <p>If there is a technical failure on our end that prevents delivery of your website, you are entitled to a full refund. We will notify you promptly if this occurs.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">How to Request</h2>
              <p>Email <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">hello@pixelpilot.ai</a> with your order details. We typically respond within 24 hours.</p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100">
            <Link href="/" className="text-violet-600 hover:underline text-sm">← Back to home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
