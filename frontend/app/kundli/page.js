"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Country, State, City } from "country-state-city";

export default function KundliPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    tob: "",
    country: "",
    state: "",
    city: "",
    lat: "",
    lon: "",
  });

  const [loading, setLoading] = useState(false);
  const [kundli, setKundli] = useState(null);
  const [error, setError] = useState("");

  const countries = Country.getAllCountries();
  const states = form.country ? State.getStatesOfCountry(form.country) : [];
  const cities =
    form.country && form.state
      ? City.getCitiesOfState(form.country, form.state)
      : [];

  // Auto-set lat/lon when city selected
  useEffect(() => {
    if (!form.city) return;

    const cityObj = cities.find((c) => c.name === form.city);
    if (!cityObj) return;

    setForm((prev) => ({
      ...prev,
      lat: cityObj.latitude,
      lon: cityObj.longitude,
    }));
  }, [form.city]);

  const submitKundli = async () => {
    if (!form.name || !form.city) {
      setError("Please fill all required details");
      return;
    }

    setLoading(true);
    setError("");
    setKundli(null);

    try {
      const res = await fetch("/api/astrology/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dob: form.dob,
          tob: form.tob,
          lat: form.lat,
          lon: form.lon,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed");

      setKundli(json?.data?.data || null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goToAdvancedKundli = () => {
    const query = new URLSearchParams({
      name: form.name,
      dob: form.dob,
      tob: form.tob,
      lat: form.lat,
      lon: form.lon,
      country: form.country,
      state: form.state,
      city: form.city,
    }).toString();

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
        <Card className="rounded-2xl shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Kundli Details</CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-5">
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              type="date"
              value={form.dob}
              onChange={(e) =>
                setForm({ ...form, dob: e.target.value })
              }
            />

            <Input
              type="time"
              value={form.tob}
              onChange={(e) =>
                setForm({ ...form, tob: e.target.value })
              }
            />

            {/* COUNTRY */}
            <Select
              onValueChange={(val) =>
                setForm({
                  ...form,
                  country: val,
                  state: "",
                  city: "",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* STATE */}
            <Select
              disabled={!form.country}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  state: val,
                  city: "",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* CITY */}
            <Select
              disabled={!form.state}
              onValueChange={(val) =>
                setForm({ ...form, city: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.name} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={submitKundli}
              className="md:col-span-2 bg-[#FFB300] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white"
              disabled={loading}
            >
              {loading ? "Generating Kundli..." : "Generate Kundli"}
            </Button>
          </CardContent>
        </Card>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* RESULT */}
        {kundli && nakshatra && (
          <div className="space-y-6">

            {/* CTA */}
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
              <CardHeader>
                <CardTitle>Nakshatra Details</CardTitle>
              </CardHeader>
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
                <CardHeader>
                  <CardTitle>Mangal Dosha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge>
                    {mangal.has_dosha ? "Present" : "Not Present"}
                  </Badge>
                  <Separator />
                  <p>{mangal.description}</p>
                </CardContent>
              </Card>
            )}

            {/* YOGAS */}
            {yogas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Yogas</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3">
                  {yogas.map((y, i) => (
                    <div key={i} className="p-3 border rounded">
                      <p className="font-medium">{y.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {y.description}
                      </p>
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
