"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function KundliPage() {
  const router = useRouter();

  const [form, setForm] = useState({ dob: "", tob: "", lat: "", lon: "" });
  const [loading, setLoading] = useState(false);
  const [kundli, setKundli] = useState(null);
  const [error, setError] = useState("");

  const submitKundli = async () => {
    setLoading(true);
    setError("");
    setKundli(null);

    try {
      const res = await fetch("/api/astrology/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed");

      // ✅ correct unwrap
      setKundli(json?.data?.data || null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goToAdvancedKundli = () => {
    const query = new URLSearchParams(form).toString();
    router.push(`/kundli/advanced?${query}`);
  };

  const nakshatra = kundli?.nakshatra_details;
  const mangal = kundli?.mangal_dosha;
  const yogas = Array.isArray(kundli?.yoga_details)
    ? kundli.yoga_details
    : [];

  const row = (label, value) => (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value ?? "—"}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-14 space-y-10">

        {/* FORM */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Kundli Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            <Input type="time" value={form.tob} onChange={e => setForm({ ...form, tob: e.target.value })} />
            <Input placeholder="Latitude" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} />
            <Input placeholder="Longitude" value={form.lon} onChange={e => setForm({ ...form, lon: e.target.value })} />
            <Button onClick={submitKundli} className="md:col-span-2" disabled={loading}>
              {loading ? "Generating..." : "Generate Kundli"}
            </Button>
          </CardContent>
        </Card>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* RESULT */}
        {kundli && nakshatra && (
          <div className="space-y-6">

            {/* CTA TO ADVANCED */}
            <Card className="border border-yellow-300 bg-yellow-50">
              <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4 py-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    Want deeper astrological insights?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get dasha periods, advanced yogas, remedies & exceptions.
                  </p>
                </div>
                <Button onClick={goToAdvancedKundli}>
                  View Advanced Kundli →
                </Button>
              </CardContent>
            </Card>

            {/* NAKSHATRA */}
            <Card>
              <CardHeader><CardTitle>Nakshatra Details</CardTitle></CardHeader>
              <CardContent>
                {row("Nakshatra", nakshatra.nakshatra?.name)}
                {row("Pada", nakshatra.nakshatra?.pada)}
                {row("Lord", nakshatra.nakshatra?.lord?.vedic_name)}
                {row("Chandra Rasi", nakshatra.chandra_rasi?.name)}
                {row("Surya Rasi", nakshatra.soorya_rasi?.name)}
                {row("Gana", nakshatra.additional_info?.ganam)}
                {row("Nadi", nakshatra.additional_info?.nadi)}
              </CardContent>
            </Card>

            {/* MANGAL DOSHA */}
            {mangal && (
              <Card>
                <CardHeader><CardTitle>Mangal Dosha</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Badge>{mangal.has_dosha ? "Present" : "Not Present"}</Badge>
                  <Separator />
                  <p>{mangal.description}</p>
                </CardContent>
              </Card>
            )}

            {/* YOGAS */}
            {yogas.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Yogas</CardTitle></CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3">
                  {yogas.map((y, i) => (
                    <div key={i} className="p-3 border rounded">
                      <p className="font-medium">{y.name}</p>
                      <p className="text-sm text-muted-foreground">{y.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
