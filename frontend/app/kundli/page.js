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
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-xl p-6 rounded-2xl shadow-xl bg-gray-900 border border-gray-800">
        <h1 className="text-2xl font-bold text-center text-purple-400">Kundli Generator</h1>
        <p className="text-gray-400 text-center mt-1">Generate your personalized Kundli PDF</p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Time of Birth</label>
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter birth city"
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-900 bg-red-950/40 text-red-300 px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-2.5 px-4 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {submitting && (
              <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {submitting ? "Generating..." : "Generate Kundli"}
          </button>
        </form>

        {successMsg && (
          <div className="mt-6 rounded-xl border border-green-900 bg-green-950/40 p-4">
            <p className="text-green-300 text-sm">{successMsg}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 border border-gray-700 transition"
                >
                  Download PDF
                </a>
              )}

              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 transition focus:outline-none focus:ring-2 focus:ring-purple-500"
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
