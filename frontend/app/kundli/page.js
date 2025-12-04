"use client";
import { useMemo, useState } from "react";

export default function KundliPage() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [city, setCity] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  // Helper: basic validators
  const isFutureDate = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const date = new Date(dateStr);
    return date > today;
  };

  const isValidTime = (timeStr) => {
    if (!timeStr) return false;
    // Accepts HH:MM (24h)
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);
    return match;
  };

  const formInvalidReason = useMemo(() => {
    if (!name || !dob || !tob || !city) return "All fields are required.";
    if (isFutureDate(dob)) return "DOB cannot be in the future.";
    if (!isValidTime(tob)) return "Enter a valid time in 24h format (HH:MM).";
    return "";
  }, [name, dob, tob, city]);

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setPdfUrl("");

    if (formInvalidReason) {
      setError(formInvalidReason);
      return;
    }

    setSubmitting(true);
    try {
      // Normalize city to Title Case to match backend cityMap keys
      const normalizedCity = city
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
        .join(" ");

      // Try JSON first to see if backend returns an URL; if not, fallback to blob
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/kundli/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, dob, tob, city: normalizedCity }),
      });

      if (!response.ok) {
        // Attempt to read JSON error
        try {
          const errJson = await response.json();
          throw new Error(errJson?.message || errJson?.error || "Failed to generate Kundli.");
        } catch {
          throw new Error("Failed to generate Kundli.");
        }
      }

      // Many backends either return { pdfUrl } JSON or a PDF blob
      let url = "";
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        url = data?.pdfUrl || "";
        if (!url && data?.buffer) {
          // In case buffer/base64 is returned
          const blob = new Blob([Uint8Array.from(atob(data.buffer), (c) => c.charCodeAt(0))], {
            type: "application/pdf",
          });
          url = URL.createObjectURL(blob);
        }
      } else if (contentType.includes("application/pdf")) {
        const blob = await response.blob();
        url = URL.createObjectURL(blob);
      } else {
        // Fallback: try blob
        const blob = await response.blob();
        url = URL.createObjectURL(blob);
      }

      setPdfUrl(url);
      setSuccessMsg("Kundli Generated Successfully! Click below to download the PDF.");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7E6] px-4 py-20">
      <div className="w-full max-w-xl p-8 rounded-[30px] shadow-lg bg-white border border-[#E5E5E5]">
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <span className="bg-[#FFB300] text-[#0A1A2F] px-4 py-1 rounded-full text-sm font-semibold">Free Kundali</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0A1A2F]">Get Personalised Kundli</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#0A1A2F] mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-lg bg-white border border-[#E5E5E5] px-4 py-3 text-[#333] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#0A1A2F] mb-2">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-lg bg-white border border-[#E5E5E5] px-4 py-3 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent transition"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A1A2F]/50">📅</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A1A2F] mb-2">Time</label>
              <div className="relative">
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  className="w-full rounded-lg bg-white border border-[#E5E5E5] px-4 py-3 text-[#333] focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent transition"
                  required
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A1A2F]/50">🕐</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A1A2F] mb-2">Location</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Delhi"
              className="w-full rounded-lg bg-white border border-[#E5E5E5] px-4 py-3 text-[#333] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#FFA726] focus:border-transparent transition"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] disabled:opacity-50 text-white font-semibold py-3 px-6 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {submitting && (
              <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {submitting ? "Generating..." : "Get Kundli"}
          </button>
        </form>

        {successMsg && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
            <p className="text-green-700 text-sm mb-4">{successMsg}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0A1A2F] hover:bg-[#081423] text-white font-medium py-2.5 px-4 transition-all duration-200"
                >
                  Download PDF
                </a>
              )}

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FFA726] to-[#FFB300] hover:from-[#FF8F00] hover:to-[#FFA726] text-white font-semibold py-2.5 px-4 transition-all duration-200"
                onClick={() => { /* Payment integration to be added later */ }}
              >
                Get Full Report for ₹249/-
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
