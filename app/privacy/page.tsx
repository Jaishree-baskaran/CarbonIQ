import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Privacy() {
  return (
    <div className="flex flex-col w-full min-h-screen text-[#291100] relative bg-[#F4F7F4]">
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <Image src="/breezy_bg.png" alt="Breezy Landscape" fill className="object-cover opacity-100" priority />
        <div className="absolute inset-0 bg-white/60 pointer-events-none backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-[800px] mx-auto p-10 mt-10 bg-white/80 backdrop-blur-md rounded-[32px] shadow-sm border border-white">
        <Link href="/" className="inline-flex items-center gap-2 text-[#5b872b] font-bold mb-6 hover:opacity-80">
          <ArrowLeft size={18} /> Back to App
        </Link>
        <h1 className="text-3xl font-fredoka font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>CarbonIQ is committed to protecting your privacy and ensuring your personal data is handled securely.</p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">Data Collection</h2>
          <p>We collect information that you provide directly to us, including carbon emission logs, state location, and organizational roles to accurately calculate India National Stats and personal risk scores.</p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">Data Usage</h2>
          <p>Your data is used solely for the purpose of the CarbonIQ platform, including generating AI insights via Vayundhra AI. Your data is not sold to third-party advertisers.</p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">Security</h2>
          <p>We utilize Supabase for secure authentication and database management, ensuring industry-standard encryption for your data at rest and in transit.</p>
        </div>
      </div>
    </div>
  );
}
