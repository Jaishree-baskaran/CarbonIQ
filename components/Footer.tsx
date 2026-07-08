import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#ECF5E2]/80 backdrop-blur-md border-t border-[#D7E3A4] py-6 relative z-50 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[13px] text-[#291100] font-medium">
          &copy; {new Date().getFullYear()} CarbonIQ India. All rights reserved.
        </div>
        <div className="flex gap-6 text-[13px] text-[#657733] font-bold">
          <Link href="/terms" className="hover:text-[#D4C04D] transition-colors">Terms and Conditions</Link>
          <Link href="/privacy" className="hover:text-[#D4C04D] transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
