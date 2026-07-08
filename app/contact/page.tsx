import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function Contact() {
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
        <h1 className="text-3xl font-fredoka font-bold mb-6">Contact Us</h1>
        <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
          <p>Have questions about CarbonIQ, Vayundhra AI, or our environmental modeling? We'd love to hear from you.</p>
          
          <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-[#EAF0E4] text-[#4A7016] rounded-full flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">Email</div>
              <div className="text-gray-500">support@carboniq.in</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-gray-100">
            <div className="w-12 h-12 bg-[#EAF0E4] text-[#4A7016] rounded-full flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div>
              <div className="font-bold text-gray-900">Office</div>
              <div className="text-gray-500">Green Tech Hub, Bangalore, India</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
