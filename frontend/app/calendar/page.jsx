"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CalendarPage() {
  const [date, setDate] = useState("");
  const [calendar, setCalendar] = useState("shaka-samvat");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCalendar = async () => {
    setLoading(true);
    const res = await axios.post("/api/calendar", {
      date,
      calendar,
      language: "en",
    });
    setResult(res.data);
    setLoading(false);
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
              onChange={(e) => setCalendar(e.target.value)}
            >
              <option value="shaka-samvat">Shaka Samvat</option>
              <option value="vikram-samvat">Vikram Samvat</option>
              <option value="tamil">Tamil</option>
              <option value="lunar">Lunar</option>
            </select>

            <Button onClick={fetchCalendar} disabled={loading}>
              {loading ? "Analyzing..." : "View Calendar Analysis"}
            </Button>
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
