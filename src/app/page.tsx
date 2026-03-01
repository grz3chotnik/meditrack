import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/home");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          MediTrack
        </h1>
        <p className="text-lg sm:text-xl text-foreground/60 max-w-lg mx-auto">
          Never miss a dose. Track your medicines, get reminders, and stay on
          top of your health. All in one place.
        </p>

        <div className="flex items-center justify-center gap-4">
          <SignedOut>
            <SignUpButton>
              <button className="bg-foreground text-background px-6 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity cursor-pointer">
                Get started
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="px-6 py-2.5 rounded-md font-medium border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
          <div className="space-y-2">
            <h3 className="font-semibold">Track daily</h3>
            <p className="text-sm text-foreground/50">
              Check off medicines as you take them throughout the day.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Get reminders</h3>
            <p className="text-sm text-foreground/50">
              Desktop and email notifications so you never forget a dose.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Stay organized</h3>
            <p className="text-sm text-foreground/50">
              Manage all your medicines and dosages in one dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
