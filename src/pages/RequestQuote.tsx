import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OrderStepper } from "../components/OrderStepper";

export function RequestQuote() {
  return (
    <div className="py-12 md:py-24 max-w-3xl mx-auto space-y-12">
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Catalog
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Request a Custom Quote
        </h1>
        <p className="text-lg text-slate-600">
          Configure your product specifications below. We will reach back out within 24 hours.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <OrderStepper />
      </div>
    </div>
  );
}
