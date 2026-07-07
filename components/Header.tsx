import { Activity, Leaf, Globe } from 'lucide-react';

export default function Header({ taglineHtml }: { taglineHtml?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <Activity size={28} strokeWidth={2.5} className="text-black" />
        <Leaf size={28} strokeWidth={2.5} className="text-black" />
        <Globe size={28} strokeWidth={2.5} className="text-black" />
      </div>
      <h1 className="font-fredoka text-[40px] text-black leading-tight tracking-[0.5px]">
        Carbon<span className="text-pink italic">IQ</span>
      </h1>
      {taglineHtml ? (
        <p className="text-[13px] font-semibold text-black/55 mt-1">{taglineHtml}</p>
      ) : (
        <p className="text-[13px] font-semibold text-black/55 mt-1">
          vayundhra is feeling <span className="text-black font-bold">happy today</span>
        </p>
      )}
    </div>
  );
}
