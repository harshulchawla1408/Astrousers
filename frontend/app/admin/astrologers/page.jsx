"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useUser, useAuth } from "@clerk/nextjs";
import { useUserContext } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";

export default function AdminAstrologersPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { role } = useUserContext();
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: "",
    category: "",
    gender: "",
    experience: "",
    languages: "",
    pricePerMinute: { chat: "", call: "", video: "" }
  });

  const backend =
    (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    if (role === "ADMIN") {
      fetchAstrologers();
    }
  }, [role]);

  const fetchAstrologers = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${backend}/api/v1/admin/astrologers`, {
        headers: {
          "x-user-id": user.id,
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to fetch astrologers:", errText);
        return;
      }

      const responseText = await res.text();
      if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
        console.error("Backend returned HTML instead of JSON");
        return;
      }

      const data = JSON.parse(responseText);
      if (data.success) {
        setAstrologers(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch astrologers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      email: "",
      expertise: "",
      category: "",
      gender: "",
      experience: "",
      languages: "",
      pricePerMinute: { chat: "", call: "", video: "" }
    });
    setSelectedAstro(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (astro) => {
    const userData = astro.userId || {};
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      expertise: Array.isArray(astro.expertise) ? astro.expertise.join(", ") : astro.expertise || "",
      category: astro.category || "",
      gender: astro.gender || "",
      experience: astro.experience?.toString() || "",
      languages: Array.isArray(astro.languages) ? astro.languages.join(", ") : astro.languages || "",
      pricePerMinute: {
        chat: astro.pricePerMinute?.chat?.toString() || "",
        call: astro.pricePerMinute?.call?.toString() || "",
        video: astro.pricePerMinute?.video?.toString() || ""
      }
    });
    setSelectedAstro(astro);
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const token = await getToken();
      const payload = {
        name: formData.name,
        email: formData.email,
        expertise: formData.expertise.split(",").map(e => e.trim()).filter(Boolean),
        category: formData.category,
        gender: formData.gender,
        experience: Number(formData.experience) || 0,
        languages: formData.languages.split(",").map(l => l.trim()).filter(Boolean),
        pricePerMinute: {
          chat: Number(formData.pricePerMinute.chat) || 0,
          call: Number(formData.pricePerMinute.call) || 0,
          video: Number(formData.pricePerMinute.video) || 0
        }
      };

      const url = selectedAstro
        ? `${backend}/api/v1/admin/astrologers/${selectedAstro._id}`
        : `${backend}/api/v1/admin/astrologers`;
      
      const method = selectedAstro ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to save astrologer:", errText);
        alert("Failed to save astrologer. Please try again.");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedAstro(null);
        fetchAstrologers();
      }
    } catch (err) {
      console.error("Error saving astrologer:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDisable = async (astroId) => {
    if (!user?.id) return;
    if (!confirm("Are you sure you want to disable this astrologer?")) return;

    try {
      const token = await getToken();
      const res = await fetch(`${backend}/api/v1/admin/astrologers/${astroId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to disable astrologer:", errText);
        alert("Failed to disable astrologer. Please try again.");
        return;
      }

      const data = await res.json();
      if (data.success) {
        fetchAstrologers();
      }
    } catch (err) {
      console.error("Error disabling astrologer:", err);
      alert("An error occurred. Please try again.");
    }
  };

  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#FFF8EE]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-4">You must be an admin to access this page.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EE]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1A2F]">
              Manage Astrologers
            </h1>
            <p className="text-gray-600">
              Add, monitor & control astrologer profiles
            </p>
          </div>

          <Button 
            onClick={handleAdd}
            className="bg-gradient-to-r from-[#FFA726] to-[#FFB300] text-white"
          >
            + Add Astrologer
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          </div>
        ) : astrologers.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-gray-500">
              No astrologers found
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {astrologers.map((astro) => {
              const userData = astro.userId || {};
              const price = astro.pricePerMinute?.chat || astro.pricePerMinute?.call || astro.pricePerMinute?.video || 0;
              const expertise = Array.isArray(astro.expertise) ? astro.expertise.join(", ") : astro.expertise || "N/A";
              
              return (
                <Card key={astro._id} className="hover:shadow-xl transition">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      {userData.name || "Unknown"}
                      <Badge variant={astro.isOnline ? "default" : "secondary"}>
                        {astro.isOnline ? "Online" : "Offline"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">
                      {expertise}
                    </p>
                    <p className="text-sm text-gray-500">
                      {userData.email || "No email"}
                    </p>
                    <p className="text-sm">
                      ⭐ {astro.rating || 0} ({astro.reviews || 0} reviews)
                    </p>
                    <p className="text-sm font-medium">
                      ₹{price}/min
                    </p>
                    {astro.disabled && (
                      <Badge variant="destructive" className="text-xs">
                        Disabled
                      </Badge>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEdit(astro)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => handleDisable(astro._id)}
                        disabled={astro.disabled}
                      >
                        {astro.disabled ? "Disabled" : "Disable"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Astrologer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Astrologer</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Create a new astrologer profile. All fields are required.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="expertise" className="block text-sm font-medium mb-1">Expertise (comma-separated) *</label>
                  <Input
                    id="expertise"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    placeholder="Vedic, Numerology, Tarot"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Category *</label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Vedic Astrology"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender *</label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      placeholder="Male/Female/Other"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium mb-1">Experience (years) *</label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="languages" className="block text-sm font-medium mb-1">Languages (comma-separated) *</label>
                    <Input
                      id="languages"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      placeholder="Hindi, English"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Per Minute (₹) *</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="priceChat" className="block text-xs text-gray-600 mb-1">Chat</label>
                      <Input
                        id="priceChat"
                        type="number"
                        value={formData.pricePerMinute.chat}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricePerMinute: { ...formData.pricePerMinute, chat: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="priceCall" className="block text-xs text-gray-600 mb-1">Call</label>
                      <Input
                        id="priceCall"
                        type="number"
                        value={formData.pricePerMinute.call}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricePerMinute: { ...formData.pricePerMinute, call: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="priceVideo" className="block text-xs text-gray-600 mb-1">Video</label>
                      <Input
                        id="priceVideo"
                        type="number"
                        value={formData.pricePerMinute.video}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricePerMinute: { ...formData.pricePerMinute, video: e.target.value }
                        })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-[#FFA726] to-[#FFB300] text-white">
                    Create Astrologer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Astrologer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Astrologer</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Update astrologer profile information.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium mb-1">Name *</label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium mb-1">Email *</label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-expertise" className="block text-sm font-medium mb-1">Expertise (comma-separated) *</label>
                  <Input
                    id="edit-expertise"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium mb-1">Category *</label>
                    <Input
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-gender" className="block text-sm font-medium mb-1">Gender *</label>
                    <Input
                      id="edit-gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-experience" className="block text-sm font-medium mb-1">Experience (years) *</label>
                    <Input
                      id="edit-experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-languages" className="block text-sm font-medium mb-1">Languages (comma-separated) *</label>
                    <Input
                      id="edit-languages"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Per Minute (₹) *</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="edit-priceChat" className="block text-xs text-gray-600 mb-1">Chat</label>
                      <Input
                        id="edit-priceChat"
                        type="number"
                        value={formData.pricePerMinute.chat}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricePerMinute: { ...formData.pricePerMinute, chat: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-priceCall" className="block text-xs text-gray-600 mb-1">Call</label>
                      <Input
                        id="edit-priceCall"
                        type="number"
                        value={formData.pricePerMinute.call}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricePerMinute: { ...formData.pricePerMinute, call: e.target.value }
                        })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-priceVideo" className="block text-xs text-gray-600 mb-1">Video</label>
                      <Input
                        id="edit-priceVideo"
                        type="number"
                        value={formData.pricePerMinute.video}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricePerMinute: { ...formData.pricePerMinute, video: e.target.value }
                        })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-[#FFA726] to-[#FFB300] text-white">
                    Update Astrologer
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}
