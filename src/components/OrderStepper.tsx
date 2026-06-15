import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronRight, Layers, FileSignature, Box, User, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

const STEPS = [
  { id: 1, name: "Material", icon: Layers },
  { id: 2, name: "Specifications", icon: FileSignature },
  { id: 3, name: "Quantity", icon: Box },
  { id: 4, name: "Contact", icon: User },
];

const MATERIALS = [
  { name: "Non-Woven", image: "/plain-non-woven-carry-bag.jpg" },
  { name: "Cotton", image: "/cotton.jpg" },
  { name: "Canvas / Jute", image: "/canvas jute.jpg" },
];
const HANDLE_TYPES = ["D-Cut", "W-Cut", "Loop Handle", "Rope Handle"];
const QUANTITIES = ["1000", "5000", "10000", "25000+"];

export function OrderStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Try to default material if passed via URL
  const searchParams = new URLSearchParams(window.location.search);
  const defaultMaterial = searchParams.get("material");
  
  let initialMaterial = "";
  if (defaultMaterial) {
    if (defaultMaterial.toLowerCase().includes("cotton")) initialMaterial = "Cotton";
    else if (defaultMaterial.toLowerCase().includes("jute") || defaultMaterial.toLowerCase().includes("canvas")) initialMaterial = "Canvas / Jute";
    else initialMaterial = "Non-Woven";
  }

  const [formData, setFormData] = useState({
    material: initialMaterial,
    width: "",
    height: "",
    handleType: "",
    quantity: "",
    printedLogo: "No",
    clientName: "",
    businessName: "",
    mobileNumber: "",
    email: "",
  });

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.material;
      case 2:
        return !!formData.width && !!formData.height && !!formData.handleType;
      case 3:
        return !!formData.quantity && !!formData.printedLogo;
      case 4:
        return !!formData.clientName && !!formData.mobileNumber;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid() && currentStep < 4) {
      setCurrentStep((c) => c + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((c) => c - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: formData.clientName,
          business_name: formData.businessName || "N/A",
          mobile_number: formData.mobileNumber,
          email: formData.email || "N/A",
          material: formData.material,
          specs_width: formData.width,
          specs_height: formData.height,
          handle_type: formData.handleType,
          quantity: formData.quantity,
          printed_logo: formData.printedLogo,
        }),
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (e) {
      alert("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 space-y-6"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <Check size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Request Received</h2>
          <p className="text-slate-600 max-w-sm mx-auto">
            Your quote request has been securely logged. Our production manager will contact you at {formData.mobileNumber} shortly.
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="h-12 px-6 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors inline-flex items-center"
        >
          Return Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-100" />
        <div 
          className="absolute left-0 top-1/2 -mt-px h-0.5 bg-slate-900 transition-all duration-500 ease-in-out" 
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        />
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const Icon = step.icon;
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white",
                  isActive ? "border-slate-900 text-slate-900" : 
                  isCompleted ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-400"
                )}
              >
                {isCompleted ? <Check size={18} /> : <Icon size={18} />}
              </div>
              <span className={cn(
                "hidden sm:block text-xs font-semibold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap",
                isActive ? "text-slate-900" : "text-slate-400"
              )}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="pt-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {/* Step 1: Material */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Select Base Material</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {MATERIALS.map((mat) => (
                    <button
                      key={mat.name}
                      onClick={() => updateForm("material", mat.name)}
                      className={cn(
                        "flex flex-col items-center justify-center text-center rounded-xl transition-all overflow-hidden border-2 p-0",
                        formData.material === mat.name 
                          ? "border-slate-900 ring-1 ring-slate-900" 
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="w-full h-32 bg-slate-100 overflow-hidden relative">
                         <img 
                           src={mat.image} 
                           alt={mat.name} 
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" 
                         />
                         {formData.material === mat.name && (
                           <div className="absolute top-2 right-2 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center animate-fade-in shadow-sm">
                              <Check size={14} />
                           </div>
                         )}
                      </div>
                      <div className={cn(
                        "w-full p-4 font-medium",
                        formData.material === mat.name ? "bg-slate-50 text-slate-900" : "bg-white text-slate-700"
                      )}>
                        {mat.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Specifications */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-900">Dimensions & Handles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Width (Inches/cm)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 12 inches"
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                      value={formData.width}
                      onChange={(e) => updateForm("width", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Height (Inches/cm)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 16 inches"
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                      value={formData.height}
                      onChange={(e) => updateForm("height", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 block">Handle Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {HANDLE_TYPES.map((type) => (
                       <button
                       key={type}
                       onClick={() => updateForm("handleType", type)}
                       className={cn(
                         "h-12 px-4 rounded-lg border text-sm font-medium transition-all text-center",
                         formData.handleType === type 
                           ? "border-slate-900 bg-slate-900 text-white" 
                           : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                       )}
                     >
                       {type}
                     </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Quantity */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-slate-900">Volume & Branding</h2>
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 block">Estimated Quantity</label>
                  <div className="flex flex-wrap gap-3">
                    {QUANTITIES.map((qty) => (
                       <button
                       key={qty}
                       onClick={() => updateForm("quantity", qty)}
                       className={cn(
                         "h-12 px-6 rounded-full border text-sm font-medium transition-all",
                         formData.quantity === qty 
                           ? "border-slate-900 bg-slate-900 text-white" 
                           : "border-slate-200 text-slate-600 hover:border-slate-300"
                       )}
                     >
                       {qty} pcs
                     </button>
                    ))}
                  </div>
                  <div className="pt-2">
                    <input 
                      type="text" 
                      placeholder="Or enter custom quantity..."
                      className="w-full sm:w-1/2 h-12 px-4 rounded-lg border border-slate-200 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all font-medium"
                      value={QUANTITIES.includes(formData.quantity) ? "" : formData.quantity}
                      onChange={(e) => updateForm("quantity", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <label className="text-sm font-semibold text-slate-700 block">Require Logo Printing?</label>
                  <div className="flex gap-3">
                    {["Yes", "No"].map((opt) => (
                       <button
                       key={opt}
                       onClick={() => updateForm("printedLogo", opt)}
                       className={cn(
                         "h-12 px-8 rounded-lg border text-sm font-medium transition-all",
                         formData.printedLogo === opt 
                           ? "border-slate-900 bg-slate-900 text-white" 
                           : "border-slate-200 text-slate-600 hover:border-slate-300"
                       )}
                     >
                       {opt}
                     </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Your Contact Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name *</label>
                    <input 
                      type="text" 
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none focus:border-slate-900 bg-slate-50 focus:bg-white transition-all font-medium"
                      value={formData.clientName}
                      onChange={(e) => updateForm("clientName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Business Name</label>
                    <input 
                      type="text" 
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none focus:border-slate-900 bg-slate-50 focus:bg-white transition-all font-medium"
                      value={formData.businessName}
                      onChange={(e) => updateForm("businessName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mobile Number *</label>
                    <input 
                      type="tel" 
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none focus:border-slate-900 bg-slate-50 focus:bg-white transition-all font-medium"
                      value={formData.mobileNumber}
                      onChange={(e) => updateForm("mobileNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full h-12 px-4 rounded-lg border border-slate-200 outline-none focus:border-slate-900 bg-slate-50 focus:bg-white transition-all font-medium"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className={cn(
            "h-12 px-6 rounded-lg font-medium transition-colors",
            currentStep === 1 || isSubmitting
              ? "text-slate-300 cursor-not-allowed" 
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          Back
        </button>
        
        {currentStep < 4 ? (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={cn(
              "h-12 px-8 rounded-lg font-medium inline-flex items-center transition-all",
              isStepValid() 
                ? "bg-slate-900 text-white hover:bg-slate-800" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            Continue
            <ChevronRight size={18} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStepValid() || isSubmitting}
            className={cn(
              "h-12 px-8 rounded-lg font-medium inline-flex items-center transition-all",
              isStepValid() && !isSubmitting
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
            <ArrowRight size={18} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
}
