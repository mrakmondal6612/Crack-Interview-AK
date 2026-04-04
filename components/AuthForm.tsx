"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { X } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import { FormType } from "@/types";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }
        // Call the new API route to set the session cookie
        const res = await fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });
        const result = await res.json();
        if (!result.success) {
          toast.error("Failed to set session. Please try again.");
          return;
        }
        toast.success("Signed in successfully.");
        // Force a full page reload to sync session
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (!user) return;
      // Save user to Firestore with photo
      await signUp({
        uid: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        profileURL: user.photoURL || "",
        password: "google-oauth", // placeholder, not used
      });
      // Set session cookie via API
      const idToken = await user.getIdToken();
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const resultSession = await res.json();
      if (!resultSession.success) {
        toast.error("Failed to set session. Please try again.");
        return;
      }
      toast.success("Signed in with Google!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      toast.error("Google sign-in failed");
      console.error("Google sign-in error:", error);
    }
  };

  const handleClose = () => {
    router.push("/");
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-4 sm:py-8">
      <div className="w-full max-w-md relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.purple.900/0.3)_0%,transparent_70%)]"></div>
        </div>
        
        <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-8">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-white transition-colors" />
          </button>

          {/* Logo and Title */}
          <div className="flex flex-col gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-600/20 blur-lg rounded-full"></div>
                <Image src="/logo.svg" alt="InterviewOrbit" width={32} height={32} className="relative w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">InterviewOrbit</h2>
            </div>
            <p className="text-center text-gray-400 text-xs sm:text-sm">
              {isSignIn ? "Welcome back to your interview journey" : "Start your interview preparation today"}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 sm:space-y-5"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  type="text"
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email Address"
                placeholder="your@email.com"
                type="email"
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2.5 sm:py-3 rounded-xl font-medium transition-all hover:scale-[1.02] shadow-lg text-sm sm:text-base"
              >
                {isSignIn ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-3 sm:gap-4 my-4 sm:my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-gray-400 text-xs sm:text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Sign-In */}
          <Button
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2.5 sm:py-3 rounded-xl font-medium transition-all hover:scale-[1.02] text-sm sm:text-base"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Image
                src="/google.svg"
                alt="Google"
                width={16}
                height={16}
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              <span className="text-sm sm:text-base">Continue with Google</span>
            </div>
          </Button>

          {/* Sign Up/In Link */}
          <p className="text-center text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6">
            {isSignIn ? "Don't have an account yet?" : "Already have an account?"}
            <Link
              href={!isSignIn ? "/sign-in" : "/sign-up"}
              className="text-purple-400 hover:text-purple-300 font-medium ml-1 transition-colors"
            >
              {!isSignIn ? "Sign In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
