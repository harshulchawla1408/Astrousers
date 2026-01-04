"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Country, State, City } from "country-state-city";

export default function MatchMakingPage() {
  const [form, setForm] = useState({
    girlName: "",
    girlDob: "",
    girlCountry: "",
    girlState: "",
    girlCity: "",
    girlLat: "",
    girlLon: "",

    boyName: "",
    boyDob: "",
    boyCountry: "",
    boyState: "",
    boyCity: "",
    boyLat: "",
    boyLon: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const countries = Country.getAllCountries();

  const girlStates = form.girlCountry
    ? State.getStatesOfCountry(form.girlCountry)
    : [];
  const boyStates = form.boyCountry
    ? State.getStatesOfCountry(form.boyCountry)
    : [];

  const girlCities =
    form.girlCountry && form.girlState
      ? City.getCitiesOfState(form.girlCountry, form.girlState)
      : [];
  const boyCities =
    form.boyCountry && form.boyState
      ? City.getCitiesOfState(form.boyCountry, form.boyState)
      : [];

  // Auto lat/lon for girl
  useEffect(() => {
    if (!form.girlCity) return;
    const city = girlCities.find((c) => c.name === form.girlCity);
    if (!city) return;

    setForm((prev) => ({
      ...prev,
      girlLat: city.latitude,
      girlLon: city.longitude,
    }));
  }, [form.girlCity]);

  // Auto lat/lon for boy
  useEffect(() => {
    if (!form.boyCity) return;
    const city = boyCities.find((c) => c.name === form.boyCity);
    if (!city) return;

    setForm((prev) => ({
      ...prev,
      boyLat: city.latitude,
      boyLon: city.longitude,
    }));
  }, [form.boyCity]);

  const submit = async () => {
    setLoading(true);
    setResult(null);
    const formatToISOWithTimezone = (localDateTime) => {
      const date = new Date(localDateTime);
      return date.toISOString().replace("Z", "+05:30");
    };

    const payload = {
      girlDob: formatToISOWithTimezone(form.girlDob),
      boyDob: formatToISOWithTimezone(form.boyDob),
      girlLat: form.girlLat,
      girlLon: form.girlLon,
      boyLat: form.boyLat,
      boyLon: form.boyLon,
    };


    const res = await fetch("/api/astrology/kundli-matching/advanced", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    setResult(json?.data || null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-14 space-y-10">

        {/* FORM */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl">
              Detailed Kundli Matching
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-10">

            {/* GIRL */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Girl Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  placeholder="Full Name"
                  value={form.girlName}
                  onChange={(e) =>
                    setForm({ ...form, girlName: e.target.value })
                  }
                />

                <Input
                  type="datetime-local"
                  value={form.girlDob}
                  onChange={(e) =>
                    setForm({ ...form, girlDob: e.target.value })
                  }
                />

                <Select
                  onValueChange={(val) =>
                    setForm({
                      ...form,
                      girlCountry: val,
                      girlState: "",
                      girlCity: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  disabled={!form.girlCountry}
                  onValueChange={(val) =>
                    setForm({
                      ...form,
                      girlState: val,
                      girlCity: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {girlStates.map((s) => (
                      <SelectItem key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  disabled={!form.girlState}
                  onValueChange={(val) =>
                    setForm({ ...form, girlCity: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {girlCities.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* BOY */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Boy Details</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  placeholder="Full Name"
                  value={form.boyName}
                  onChange={(e) =>
                    setForm({ ...form, boyName: e.target.value })
                  }
                />

                <Input
                  type="datetime-local"
                  value={form.boyDob}
                  onChange={(e) =>
                    setForm({ ...form, boyDob: e.target.value })
                  }
                />

                <Select
                  onValueChange={(val) =>
                    setForm({
                      ...form,
                      boyCountry: val,
                      boyState: "",
                      boyCity: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  disabled={!form.boyCountry}
                  onValueChange={(val) =>
                    setForm({
                      ...form,
                      boyState: val,
                      boyCity: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {boyStates.map((s) => (
                      <SelectItem key={s.isoCode} value={s.isoCode}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  disabled={!form.boyState}
                  onValueChange={(val) =>
                    setForm({ ...form, boyCity: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {boyCities.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={submit}
              className="w-full bg-[#FFB300] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white"
            >
              {loading ? "Matching Kundli..." : "Match Kundli"}
            </Button>
          </CardContent>
        </Card>

        {/* RESULT */}
        {result && (
          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle>Match Verdict</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    result.message.type === "good"
                      ? "default"
                      : "destructive"
                  }
                >
                  {result.message.type.toUpperCase()}
                </Badge>
                <p className="mt-2">{result.message.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guna Milan Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">
                  {result.guna_milan.total_points} /{" "}
                  {result.guna_milan.maximum_points}
                </p>
              </CardContent>
            </Card>

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