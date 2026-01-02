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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Country, State, City } from "country-state-city";

export default function AdvancedKundliPage() {
  const params = useSearchParams();

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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const countries = Country.getAllCountries();
  const states = form.country ? State.getStatesOfCountry(form.country) : [];
  const cities =
    form.country && form.state
      ? City.getCitiesOfState(form.country, form.state)
      : [];

  // Autofill DOB & TOB if coming from basic kundli
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: params.get("name") || "",
      dob: params.get("dob") || "",
      tob: params.get("tob") || "",
      lat: params.get("lat") || "",
      lon: params.get("lon") || "",
      country: params.get("country") || "",
      state: params.get("state") || "",
      city: params.get("city") || "",
    }));
  }, []);

  // When city changes → auto-set lat/lon
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

  const submit = async () => {
    if (!form.name || !form.city) {
      alert("Please fill all required details");
      return;
    }

    setLoading(true);
    setData(null);

    const res = await fetch("/api/astrology/kundli/advanced", {
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
    setData(json?.data || null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-14 space-y-10">

        {/* FORM */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-[#0A1A2F]">
              Advanced Kundli Details
            </CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-5">
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input type="date" value={form.dob} disabled />
            <Input type="time" value={form.tob} disabled />

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
              className="md:col-span-2 bg-[#FFB300] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white"
              onClick={submit}
            >
              {loading ? "Generating Advanced Kundli..." : "Generate Advanced Kundli"}
            </Button>
          </CardContent>
        </Card>

        {/* RESULT */}
        {data && (
          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Mangal Dosha (Advanced)</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  {data.mangal_dosha.has_dosha ? "Present" : "Not Present"}
                </Badge>
                <p className="mt-2">{data.mangal_dosha.description}</p>
              </CardContent>
            </Card>

            <Accordion type="multiple">
              {data.yoga_details.map((y, i) => (
                <AccordionItem key={i} value={`yoga-${i}`}>
                  <AccordionTrigger>{y.name}</AccordionTrigger>
                  <AccordionContent>
                    <p>{y.description}</p>
                    <ul className="list-disc pl-5 mt-2">
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
