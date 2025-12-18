"use client";
import { useState } from "react";
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

export default function MatchMakingPage() {
  const [form, setForm] = useState({
    girlDob: "",
    girlLat: "",
    girlLon: "",
    boyDob: "",
    boyLat: "",
    boyLon: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/astrology/kundli-matching/advanced", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    setResult(json?.data || null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-14 space-y-8">

        {/* FORMS */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Kundli Matching</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <div>
              <h3 className="font-semibold mb-2">Girl Details</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <Input type="datetime-local" onChange={e => setForm({ ...form, girlDob: e.target.value })} />
                <Input placeholder="Latitude" onChange={e => setForm({ ...form, girlLat: e.target.value })} />
                <Input placeholder="Longitude" onChange={e => setForm({ ...form, girlLon: e.target.value })} />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Boy Details</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <Input type="datetime-local" onChange={e => setForm({ ...form, boyDob: e.target.value })} />
                <Input placeholder="Latitude" onChange={e => setForm({ ...form, boyLat: e.target.value })} />
                <Input placeholder="Longitude" onChange={e => setForm({ ...form, boyLon: e.target.value })} />
              </div>
            </div>

            <Button onClick={submit} className="w-full">
              {loading ? "Matching..." : "Match Kundli"}
            </Button>
          </CardContent>
        </Card>

        {/* RESULT */}
        {result && (
          <div className="space-y-6">

            {/* OVERALL MESSAGE */}
            <Card>
              <CardHeader>
                <CardTitle>Match Verdict</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={result.message.type === "good" ? "default" : "destructive"}>
                  {result.message.type.toUpperCase()}
                </Badge>
                <p className="mt-2">{result.message.description}</p>
              </CardContent>
            </Card>

            {/* GUNA MILAN */}
            <Card>
              <CardHeader>
                <CardTitle>Guna Milan Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {result.guna_milan.total_points} / {result.guna_milan.maximum_points}
                </p>
              </CardContent>
            </Card>

            {/* KOOT DETAILS */}
            <Accordion type="multiple">
              {result.guna_milan.guna.map((g) => (
                <AccordionItem key={g.id} value={g.name}>
                  <AccordionTrigger>
                    {g.name} — {g.obtained_points}/{g.maximum_points}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>{g.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* MANGAL DOSHA */}
            <Card>
              <CardHeader>
                <CardTitle>Mangal Dosha</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Girl</h4>
                  <p>{result.girl_mangal_dosha_details.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Boy</h4>
                  <p>{result.boy_mangal_dosha_details.description}</p>
                </div>
              </CardContent>
            </Card>

          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
