export default function BillingPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Billing</h1>
      <p className="text-slate-500 mb-8">Your payment history and invoices.</p>
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="text-5xl mb-4">💳</div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">No payments yet</h2>
        <p className="text-slate-500 text-sm">Your invoices will appear here once you start a project.</p>
      </div>
    </div>
  );
}
