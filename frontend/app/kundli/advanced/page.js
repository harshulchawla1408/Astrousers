"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function AdvancedKundliPage() {
  const params = useSearchParams();

  const [form, setForm] = useState({
    dob: "",
    tob: "",
    lat: "",
    lon: "",
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ AUTO-FILL FROM BASIC KUNDLI
  useEffect(() => {
    setForm({
      dob: params.get("dob") || "",
      tob: params.get("tob") || "",
      lat: params.get("lat") || "",
      lon: params.get("lon") || "",
    });
  }, []);

  const submit = async () => {
    setLoading(true);
    setData(null);

    const res = await fetch("/api/astrology/kundli/advanced", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    setData(json?.data || null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-14 space-y-8">

        {/* FORM */}
        <Card>
          <CardHeader><CardTitle>Advanced Kundli</CardTitle></CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Input type="date" value={form.dob} disabled />
            <Input type="time" value={form.tob} disabled />
            <Input value={form.lat} disabled />
            <Input value={form.lon} disabled />
            <Button className="md:col-span-2" onClick={submit}>
              {loading ? "Generating..." : "Generate Advanced Kundli"}
            </Button>
          </CardContent>
        </Card>

        {/* RESULT */}
        {data && (
          <div className="space-y-6">

            {/* MANGAL DOSHA */}
            <Card>
              <CardHeader><CardTitle>Mangal Dosha (Advanced)</CardTitle></CardHeader>
              <CardContent>
                <Badge>{data.mangal_dosha.has_dosha ? "Present" : "Not Present"}</Badge>
                <p className="mt-2">{data.mangal_dosha.description}</p>
              </CardContent>
            </Card>

            {/* YOGAS */}
            <Accordion type="multiple">
              {data.yoga_details.map((y, i) => (
                <AccordionItem key={i} value={`yoga-${i}`}>
                  <AccordionTrigger>{y.name}</AccordionTrigger>
                  <AccordionContent>
                    <p>{y.description}</p>
                    <ul className="list-disc pl-4">
                      {y.yoga_list.map((yy, j) => (
                        <li key={j}>
                          {yy.name} — {yy.has_yoga ? "Yes" : "No"}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* DASHAS */}
            <Accordion type="multiple">
              {data.dasha_periods.map((d, i) => (
                <AccordionItem key={i} value={`dasha-${i}`}>
                  <AccordionTrigger>
                    {d.name} ({d.start} → {d.end})
                  </AccordionTrigger>
                  <AccordionContent>
                    {d.antardasha.map((a, j) => (
                      <p key={j} className="pl-4">
                        {a.name} ({a.start} → {a.end})
                      </p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
