"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileURL, setProfileURL] = useState("/user-avatar.png");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Use actual Firebase profile data, not just email extraction
        const displayName = firebaseUser.displayName || getDisplayName(firebaseUser);
        setName(displayName);
        setEmail(firebaseUser.email || "");
        setProfileURL(firebaseUser.photoURL || "/user-avatar.png");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    
    try {
      if (user) {
        // Update Firebase user profile using imported function
        await updateProfile(user, {
          displayName: name,
          photoURL: profileURL
        });
        
        // Update local state to reflect changes immediately
        setUser({
          ...user,
          displayName: name,
          photoURL: profileURL
        });
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
    
    setSaving(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    try {
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      setProfileURL(tempUrl);
      
      // Here you would typically upload to a service like S3
      // For now, we'll just use the temporary URL
      // In production, you'd want to upload to your storage service
      
      setSuccess(false);
    } catch (err: any) {
      alert("Photo upload failed: " + (err?.message || err));
      // Revert to original photo
      if (user) {
        setProfileURL(user.photoURL || "/user-avatar.png");
      }
    }
    setUploading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Please sign in to view your profile.</p>
          <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-8">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">My Profile</h1>
          
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative">
              <Image
                src={profileURL}
                alt={name}
                width={120}
                height={120}
                className="rounded-full border-4 border-purple-500 shadow-lg"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors border-2 border-dark-900"
                disabled={uploading}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
              <p className="text-purple-200">{email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Profile Photo
              </label>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={uploading}
              />
              <Button
                variant="outline"
                className="w-full border-purple-600 text-purple-200 hover:bg-purple-900/20"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Choose New Photo"}
              </Button>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleSave}
              disabled={saving || uploading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            {success && (
              <div className="text-center text-green-400 font-medium">
                Profile updated successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
