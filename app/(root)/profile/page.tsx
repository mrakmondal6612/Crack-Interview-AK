"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileURL, setProfileURL] = useState("/user-avatar.png");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch user data from API
    fetch("/api/session")
      .then(res => res.json())
      .then(data => {
        setName(data.name || "");
        setEmail(data.email || "");
        setProfileURL(data.profileURL || "/user-avatar.png");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, profileURL }),
    });
    setSaving(false);
    if (res.ok) setSuccess(true);
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    let url;
    try {
      // Get a signed upload URL from the server
      const res = await fetch("/api/profile/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        alert("Failed to get upload URL: " + (data.error || res.status));
        setUploading(false);
        return;
      }
      url = data.url;
      // Upload the file directly to S3
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      // The public URL for the uploaded image
      const publicUrl = url.split("?")[0];
      setProfileURL(publicUrl);
    } catch (err) {
      alert("Photo upload failed: " + (err?.message || err));
    }
    setUploading(false);
  }

  if (loading) return <div className="text-primary-200 text-center mt-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 bg-dark-900 rounded-lg shadow-lg p-8 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-primary-100 mb-2">My Profile</h1>
      <div className="flex flex-col items-center gap-2">
        <Image
          src={profileURL}
          alt={name}
          width={80}
          height={80}
          className="rounded-full border-2 border-primary-300"
        />
        <span className="text-lg text-primary-100 font-semibold">{name}</span>
        <span className="text-primary-200">{email}</span>
      </div>
      <div className="w-full flex flex-col gap-4 mt-6">
        <label className="text-primary-200">Update Name</label>
        <input
          type="text"
          className="px-3 py-2 rounded bg-dark-800 text-primary-100 border border-dark-700 w-full"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label className="text-primary-200">Update Photo</label>
        <input
          type="file"
          className="w-full"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading}
        />
        <Button className="w-full mt-2" onClick={handleSave} disabled={saving || uploading}>
          {saving ? "Saving..." : uploading ? "Uploading..." : "Save Changes"}
        </Button>
        {success && <span className="text-green-400 text-center">Profile updated!</span>}
      </div>
    </div>
  );
}
