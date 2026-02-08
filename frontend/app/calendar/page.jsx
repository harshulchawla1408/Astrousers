"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const calendarOptions = [
  { label: "Tamil", value: "tamil", languages: ["en", "ta"] },
  { label: "Malayalam", value: "malayalam", languages: ["en", "ml"] },
  { label: "Shaka Samvat", value: "shaka-samvat", languages: ["en", "ml", "hi", "ta", "te"] },
  { label: "Vikram Samvat", value: "vikram-samvat", languages: ["en", "ml", "hi", "ta", "te"] },
  { label: "Amanta", value: "amanta", languages: ["en", "ml", "hi", "ta", "te"] },
  { label: "Purnimanta", value: "purnimanta", languages: ["en", "ml", "hi", "ta", "te"] },
  { label: "Hijri", value: "hijri", languages: ["en"] },
  { label: "Gujarati", value: "gujarati", languages: ["en", "gu"] },
  { label: "Bengali", value: "bengali", languages: ["en", "bn"] },
  { label: "Lunar", value: "lunar", languages: ["en", "ml", "hi", "ta", "te"] },
];

export default function CalendarPage() {
  const [date, setDate] = useState("");
  const [calendar, setCalendar] = useState(calendarOptions[0].value);
  const [language, setLanguage] = useState(calendarOptions[0].languages[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedCalendar = useMemo(
    () => calendarOptions.find((option) => option.value === calendar),
    [calendar]
  );

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          calendar,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch calendar");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">
          Hindu & Regional Calendar Analysis
        </h1>

        <Card className="mb-8">
          <CardContent className="space-y-4">
            <input
              type="date"
              className="border p-2 w-full"
              onChange={(e) => setDate(e.target.value)}
            />

            <select
              className="border p-2 w-full"
              value={calendar}
              onChange={(e) => {
                const nextCalendar = e.target.value;
                setCalendar(nextCalendar);
                const option = calendarOptions.find((opt) => opt.value === nextCalendar);
                if (option && !option.languages.includes(language)) {
                  setLanguage(option.languages[0]);
                }
              }}
            >
              {calendarOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="border p-2 w-full"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {(selectedCalendar?.languages || ["en"]).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <Button onClick={fetchCalendar} disabled={loading}>
              {loading ? "Analyzing..." : "View Calendar Analysis"}
            </Button>

            {error && <p className="text-red-600">{error}</p>}
          </CardContent>
        </Card>

        {result && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Calendar Details</CardTitle>
              </CardHeader>
              <CardContent>
                <p><b>Year:</b> {result.calendar.year_name}</p>
                <p><b>Month:</b> {result.calendar.month_name}</p>
                <p><b>Day:</b> {result.calendar.day}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Astrological Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc ml-6">
                  {result.analysis.predictions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>

                <p><b>Do:</b> {result.analysis.dos.join(", ")}</p>
                <p><b>Don't:</b> {result.analysis.donts.join(", ")}</p>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
