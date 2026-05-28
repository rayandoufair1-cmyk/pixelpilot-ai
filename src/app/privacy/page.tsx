import Link from "next/link";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";

export const metadata = { title: "Privacy Policy — PixelPilot AI" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm mb-10">Last updated: June 2025</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
              <p>When you use PixelPilot AI, we collect information you provide directly — including your name, email address, company name, and project intake details. We also collect payment information through Stripe (we never store card details ourselves). We may collect usage data such as pages visited and actions taken within our portal.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
              <p>We use your information to deliver our web design services — generating your website, communicating project updates, processing payments, and providing customer support. We do not sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">3. Third-Party Services</h2>
              <p>We use the following third-party services to operate our platform: Supabase (database and authentication), Stripe (payments), Vercel (hosting and deployment), Resend (transactional email), and Anthropic (AI website generation). Each service has its own privacy policy governing how they handle data.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures including encrypted connections (HTTPS), row-level security on our database, and secure authentication. Your data is stored on Supabase infrastructure in the United States.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">5. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">hello@pixelpilot.ai</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact</h2>
              <p>Questions about this policy? Email us at <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">hello@pixelpilot.ai</a>.</p>
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
