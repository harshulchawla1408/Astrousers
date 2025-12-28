"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Country, State, City } from "country-state-city";

export default function PanchangPage() {
  const [form, setForm] = useState({
    date: "",
    time: "",
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

  // Auto lat/lon when city selected
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
    setLoading(true);
    setData(null);

    const res = await fetch("/api/astrology/panchang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        time: form.time,
        lat: form.lat,
        lon: form.lon,
      }),
    });

    const json = await res.json();
    setData(json?.data || null);
    setLoading(false);
  };

  const TimeBox = ({ items }) => (
    <div className="space-y-2">
      {items.map((i, idx) => (
        <div
          key={idx}
          className="p-3 rounded-xl border bg-white flex justify-between"
        >
          <span className="font-medium">{i.name}</span>
          <span className="text-sm text-muted-foreground">
            {i.start} → {i.end}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF7E6]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-14 space-y-10">

        {/* FORM */}
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl">Daily Panchang</CardTitle>
          </CardHeader>

          <CardContent className="grid md:grid-cols-4 gap-4">
            <Input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <Input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
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
                <SelectValue placeholder="State" />
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
                <SelectValue placeholder="City" />
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
              className="md:col-span-4 bg-[#FFB300] text-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white"
              onClick={submit}
            >
              {loading ? "Fetching Panchang..." : "Get Panchang"}
            </Button>
          </CardContent>
        </Card>

        {/* RESULT */}
        {data && (
          <div className="space-y-6">

            {/* SUMMARY */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardContent className="grid md:grid-cols-4 gap-4 text-center py-6">
                <div>
                  <p className="text-sm text-muted-foreground">Vaara</p>
                  <p className="text-lg font-semibold">{data.vaara}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sunrise</p>
                  <p>{data.sunrise}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sunset</p>
                  <p>{data.sunset}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Moonrise</p>
                  <p>{data.moonrise}</p>
                </div>
              </CardContent>
            </Card>

            {/* TABS */}
            <Tabs defaultValue="nakshatra">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="nakshatra">Nakshatra</TabsTrigger>
                <TabsTrigger value="tithi">Tithi</TabsTrigger>
                <TabsTrigger value="yoga">Yoga</TabsTrigger>
                <TabsTrigger value="karana">Karana</TabsTrigger>
              </TabsList>

              <TabsContent value="nakshatra">
                <TimeBox items={data.nakshatra} />
              </TabsContent>

              <TabsContent value="tithi">
                <TimeBox items={data.tithi} />
              </TabsContent>

              <TabsContent value="yoga">
                <TimeBox items={data.yoga} />
              </TabsContent>

              <TabsContent value="karana">
                <TimeBox items={data.karana} />
              </TabsContent>
            </Tabs>

            {/* AUSPICIOUS */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">
                  Auspicious Periods
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {data.auspicious_period.map((a) => (
                  <div
                    key={a.id}
                    className="border rounded-xl p-4 bg-green-50"
                  >
                    <p className="font-semibold">{a.name}</p>
                    {a.period.map((p, i) => (
                      <p key={i} className="text-sm">
                        {p.start} → {p.end}
                      </p>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* INAUSPICIOUS */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700">
                  Inauspicious Periods
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {data.inauspicious_period.map((a) => (
                  <div
                    key={a.id}
                    className="border rounded-xl p-4 bg-red-50"
                  >
                    <p className="font-semibold">{a.name}</p>
                    {a.period.map((p, i) => (
                      <p key={i} className="text-sm">
                        {p.start} → {p.end}
                      </p>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
