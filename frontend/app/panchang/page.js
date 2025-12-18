"use client";
import { useState } from "react";
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

export default function PanchangPage() {
  const [form, setForm] = useState({
    date: "",
    time: "",
    lat: "",
    lon: "",
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setData(null);

    const res = await fetch("/api/astrology/panchang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    setData(json?.data || null);
    setLoading(false);
  };

  const TimeBox = ({ title, items }) => (
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
      <main className="max-w-6xl mx-auto px-4 py-14 space-y-8">

        {/* FORM */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Panchang</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <Input type="date" onChange={e => setForm({ ...form, date: e.target.value })} />
            <Input type="time" onChange={e => setForm({ ...form, time: e.target.value })} />
            <Input placeholder="Latitude" onChange={e => setForm({ ...form, lat: e.target.value })} />
            <Input placeholder="Longitude" onChange={e => setForm({ ...form, lon: e.target.value })} />
            <Button className="md:col-span-4" onClick={submit}>
              {loading ? "Fetching..." : "Get Panchang"}
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
                <TimeBox title="Nakshatra" items={data.nakshatra} />
              </TabsContent>

              <TabsContent value="tithi">
                <TimeBox title="Tithi" items={data.tithi} />
              </TabsContent>

              <TabsContent value="yoga">
                <TimeBox title="Yoga" items={data.yoga} />
              </TabsContent>

              <TabsContent value="karana">
                <TimeBox title="Karana" items={data.karana} />
              </TabsContent>
            </Tabs>

            {/* AUSPICIOUS */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">Auspicious Periods</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {data.auspicious_period.map((a) => (
                  <div key={a.id} className="border rounded-xl p-4 bg-green-50">
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
                <CardTitle className="text-red-700">Inauspicious Periods</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                {data.inauspicious_period.map((a) => (
                  <div key={a.id} className="border rounded-xl p-4 bg-red-50">
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
