export default function SupportPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Support</h1>
      <p className="text-slate-500 mb-8">Need help? We're here for you.</p>
      <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
          <span className="text-2xl">💬</span>
          <div>
            <div className="font-semibold text-slate-800">Chat with AI Project Manager</div>
            <div className="text-slate-500 text-sm">Go into any project and use the chat to ask questions or request changes.</div>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50">
          <span className="text-2xl">📧</span>
          <div>
            <div className="font-semibold text-slate-800">Email Support</div>
            <div className="text-slate-500 text-sm">
              Reach us at{" "}
              <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">
                hello@pixelpilot.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
