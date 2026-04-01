import { User } from "firebase/auth";

/**
 * Get display name from Firebase user
 * Uses displayName if available, otherwise extracts from email
 */
export function getDisplayName(user: User | null): string {
  if (!user) return "";
  
  // If displayName exists, use it
  if (user.displayName) return user.displayName;
  
  // If email exists, extract name part (before @) and capitalize
  if (user.email) {
    const emailPart = user.email.split('@')[0];
    // Replace dots and underscores with spaces and capitalize first letter
    return emailPart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return "";
}

/**
 * Get user data object with consistent display name
 */
export function getUserData(user: User | null) {
  if (!user) return null;
  
  return {
    name: getDisplayName(user),
    email: user.email || "",
    photoURL: user.photoURL || undefined,
    uid: user.uid
  };
}
