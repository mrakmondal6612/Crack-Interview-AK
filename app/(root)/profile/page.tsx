"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/client";
import { onAuthStateChanged, User, updateProfile } from "firebase/auth";
import { getDisplayName } from "@/lib/utils/user";

export default function ProfilePage() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileURL, setProfileURL] = useState("/user-avatar.png");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Use actual Firebase profile data for displayName
        const displayName = user.displayName || getDisplayName(user);
        setName(displayName);
        setEmail(user.email || "");
        
        // Try to get profile photo from database first
        try {
          const res = await fetch(`/api/user/${user.uid}`);
          if (res.ok) {
            const userData = await res.json();
            if (userData.profileURL) {
              setProfileURL(userData.profileURL);
            } else {
              setProfileURL(user.photoURL || "/user-avatar.png");
            }
          } else {
            setProfileURL(user.photoURL || "/user-avatar.png");
          }
        } catch {
          setProfileURL(user.photoURL || "/user-avatar.png");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSuccess(false);
    
    try {
      if (firebaseUser) {
        // Update Firebase user profile (only displayName, not photoURL due to length limits)
        await updateProfile(firebaseUser, {
          displayName: name
        });
        
        // Update database (includes photoURL)
        await fetch('/api/profile/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            profileURL: profileURL
          })
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
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }
    
    setUploading(true);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setProfileURL(base64String);
        
        // Automatically save to database when photo is selected
        if (firebaseUser) {
          try {
            // Update database only (Firebase Auth has URL length limits)
            await fetch('/api/profile/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: name,
                profileURL: base64String
              })
            });
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } catch (error) {
            console.error("Failed to save photo:", error);
            alert("Failed to save photo. Please try again.");
          }
        }
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
    } catch (err: any) {
      alert("Photo upload failed: " + (err?.message || err));
      // Revert to original photo
      if (firebaseUser) {
        setProfileURL(firebaseUser.photoURL || "/user-avatar.png");
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

  if (!firebaseUser) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 py-4 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-purple-500/30 p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center">My Profile</h1>
          
          <div className="flex flex-col items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="relative">
              <Image
                src={profileURL}
                alt={name}
                width={120}
                height={120}
                className="rounded-full border-4 border-purple-500 shadow-lg w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors border-2 border-dark-900"
                disabled={uploading}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{name}</h2>
              <p className="text-purple-200 text-sm sm:text-base">{email}</p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:bg-white/20 transition-colors text-sm sm:text-base"
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
                className="w-full border-purple-600 text-purple-200 hover:bg-purple-900/20 py-2 sm:py-3 text-sm sm:text-base"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Choose New Photo (Auto-save)"}
              </Button>
              <p className="text-xs text-purple-300 mt-2">Max 2MB. Photo will be saved automatically.</p>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 sm:py-3 text-sm sm:text-base"
              onClick={handleSave}
              disabled={saving || uploading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            {success && (
              <div className="text-center text-green-400 font-medium text-sm sm:text-base">
                Profile updated successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
