import { useState, useEffect } from "react";
// Removed unused import
import { MessageSquare, Phone, X, Search, MoreVertical, Building2, User, Hash } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

type Quote = {
  id: number;
  client_name: string;
  business_name: string;
  mobile_number: string;
  email: string;
  material: string;
  specs_width: string;
  specs_height: string;
  handle_type: string;
  quantity: string;
  printed_logo: string;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700 border-blue-200",
  "Quoted": "bg-purple-100 text-purple-700 border-purple-200",
  "Stitching": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Ready": "bg-green-100 text-green-700 border-green-200",
};

const STATUSES = ["New", "Quoted", "Stitching", "Ready"];

export function Admin() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/quotes");
      const data = await res.json();
      setQuotes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/quotes/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // Optimistic update
      setQuotes((prev) => prev.map(q => q.id === id ? { ...q, status } : q));
      if (selectedQuote?.id === id) {
        setSelectedQuote({ ...selectedQuote, status });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openWhatsApp = (quote: Quote) => {
    const msg = encodeURIComponent(
      `Hello ${quote.client_name}, this is regarding your request for ${quote.quantity}pcs of ${quote.material} bags (${quote.specs_width}x${quote.specs_height}). Please let us know when is a good time to discuss the quote.`
    );
    window.open(`https://wa.me/91${quote.mobile_number}?text=${msg}`, '_blank');
  };

  return (
    <div className="py-8 min-h-screen flex flex-col md:flex-row gap-8 relative">
      {/* Sidebar Mini */}
      <aside className="hidden md:flex w-64 flex-col space-y-8 h-[calc(100vh-64px)] sticky top-8">
        <div>
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xl px-2">
            <Building2 className="text-blue-600" />
            FactoryAdmin
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a className="flex items-center px-3 py-2 bg-slate-200 text-slate-900 font-medium rounded-lg">
            Dashboard
          </a>
          <a className="flex items-center px-3 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors">
            Production Line
          </a>
          <a className="flex items-center px-3 py-2 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors">
            Clients
          </a>
        </nav>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Quotes & Orders</h1>
            <p className="text-sm text-slate-500">Manage incoming leads and production status.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white w-64 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400">Loading records...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {quotes.map((quote) => (
                  <tr 
                    key={quote.id} 
                    onClick={() => setSelectedQuote(quote)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-slate-500">
                      #{quote.id.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{quote.client_name}</p>
                      <p className="text-xs text-slate-500">{quote.business_name !== "N/A" ? quote.business_name : ""}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {quote.material}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {quote.quantity}
                    </td>
                    <td className="px-6 py-4">
                       <span 
                        className={cn(
                          "inline-flex font-medium px-2.5 py-0.5 rounded-md border text-xs",
                          STATUS_COLORS[quote.status] || "bg-slate-100 text-slate-700 border-slate-200"
                        )}
                       >
                         {quote.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 whitespace-nowrap">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {quotes.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No quotes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Slide-over Detail Panel */}
      <AnimatePresence>
        {selectedQuote && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuote(null)}
              className="fixed inset-0 bg-slate-900 z-40"
            />
            <motion.div
              initial={{ x: "100%", boxShadow: "-10px 0 30px rgba(0,0,0,0)" }}
              animate={{ x: 0, boxShadow: "-10px 0 30px rgba(0,0,0,0.1)" }}
              exit={{ x: "100%", boxShadow: "-10px 0 30px rgba(0,0,0,0)" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-50 z-50 flex flex-col border-l border-slate-200"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Order #{selectedQuote.id.toString().padStart(4, '0')}</h2>
                  <span className={cn(
                    "inline-flex font-medium px-2 py-0.5 rounded-md border text-[11px] uppercase tracking-wide",
                    STATUS_COLORS[selectedQuote.status]
                  )}>
                    {selectedQuote.status}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={`tel:+91${selectedQuote.mobile_number}`}
                    className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-all gap-2"
                  >
                    <Phone size={20} />
                    <span className="font-semibold text-sm">Call Client</span>
                  </a>
                  <button 
                    onClick={() => openWhatsApp(selectedQuote)}
                    className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-green-400 hover:bg-green-50 text-slate-700 hover:text-green-700 transition-all gap-2"
                  >
                    <MessageSquare size={20} />
                    <span className="font-semibold text-sm">WhatsApp</span>
                  </button>
                </div>

                {/* Status Update */}
                <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pipeline Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map(s => (
                      <button 
                        key={s}
                        onClick={() => updateStatus(selectedQuote.id, s)}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium rounded-lg border transition-all",
                          selectedQuote.status === s 
                          ? "bg-slate-900 border-slate-900 text-white" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Specs Bento */}
                <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Specifications</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Material</p>
                      <p className="font-medium text-slate-900">{selectedQuote.material}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Size (W x H)</p>
                      <p className="font-medium text-slate-900">{selectedQuote.specs_width} × {selectedQuote.specs_height}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Handle</p>
                      <p className="font-medium text-slate-900">{selectedQuote.handle_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Quantity</p>
                      <p className="font-medium text-slate-900">{selectedQuote.quantity} pcs</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-1">Branding / Logo Print</p>
                      <p className="font-medium text-slate-900">{selectedQuote.printed_logo}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 space-y-4 mb-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Info</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <User className="text-slate-400" size={18} />
                      <div>
                        <p className="font-medium text-slate-900">{selectedQuote.client_name}</p>
                        <p className="text-sm text-slate-500">{selectedQuote.business_name}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <Phone className="text-slate-400" size={18} />
                      <p className="font-medium text-slate-900 font-mono">+91 {selectedQuote.mobile_number}</p>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <span className="text-slate-400 font-bold text-sm">@</span>
                      <p className="font-medium text-slate-900 text-sm">{selectedQuote.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
