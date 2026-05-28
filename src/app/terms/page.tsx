import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata = { title: "Terms of Service — PixelPilot AI" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-400 text-sm mb-10">Last updated: June 2025</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Services</h2>
              <p>PixelPilot AI provides AI-powered web design services. Upon payment, we will generate a custom website based on the information you provide in the intake form. Delivery timelines are estimates and not guarantees.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. Payment</h2>
              <p>All prices are listed in USD and are one-time payments. Payments are processed securely through Stripe. By purchasing, you authorize us to charge the stated amount to your payment method.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Intellectual Property</h2>
              <p>Upon full payment and delivery, you own the rights to the website we generate for you. PixelPilot AI retains the right to use AI-generated work as portfolio examples unless you request otherwise in writing.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Revisions</h2>
              <p>Each plan includes a specified number of revision rounds. Revisions are requested through the client portal chat and are subject to the scope of the original project. Additional revisions beyond the plan limit may be purchased separately.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Limitation of Liability</h2>
              <p>PixelPilot AI is not liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability is limited to the amount paid for the specific service in question.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact</h2>
              <p>Questions? Email us at <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">hello@pixelpilot.ai</a>.</p>
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
