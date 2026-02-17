import React from "react";
import Image from "next/image";
import MyJuristLogoWithWordmark from "./landing/MyJuristLogoWithWordmark";

const IconSearchDocument: React.FC<{ className?: string }> = ({ className = "" }) => {
  const id = React.useId().replace(/:/g, "");
  const gradientId = `search-doc-grad-${id}`;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
      </defs>
      <circle cx="11" cy="11" r="7" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
      <path d="m20 20-4-4" stroke={`url(#${gradientId})`} strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="6" width="6" height="8" rx="1" fill={`url(#${gradientId})`} opacity="0.3" />
      <line x1="7.5" y1="9" x2="10.5" y2="9" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <line x1="7.5" y1="11" x2="10.5" y2="11" stroke={`url(#${gradientId})`} strokeWidth="1" />
    </svg>
  );
};

const IconLightning: React.FC<{ className?: string }> = ({ className = "" }) => {
  const id = React.useId().replace(/:/g, "");
  const gradientId = `lightning-grad-${id}`;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
      </defs>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill={`url(#${gradientId})`} />
    </svg>
  );
};

const IconShieldDocument: React.FC<{ className?: string }> = ({ className = "" }) => {
  const id = React.useId().replace(/:/g, "");
  const gradientId = `shield-doc-grad-${id}`;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
        fill={`url(#${gradientId})`}
        opacity="0.2"
      />
      <path
        d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
      />
      <rect x="8" y="8" width="8" height="10" rx="1" fill={`url(#${gradientId})`} opacity="0.4" />
      <line x1="9.5" y1="11" x2="14.5" y2="11" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <line x1="9.5" y1="13" x2="14.5" y2="13" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <line x1="9.5" y1="15" x2="12.5" y2="15" stroke={`url(#${gradientId})`} strokeWidth="1" />
    </svg>
  );
};

export default function CompanyInfo() {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#0f172a]">
      <div className="absolute bottom-[57px] left-[3px] z-0 opacity-30 mix-blend-luminosity">
        <Image
          src="/gavel.png"
          alt="Gavel"
          width={408}
          height={310}
          className="h-[310px] w-[408px] object-contain"
          priority
        />
      </div>

      <div className="absolute left-[18.72%] top-[100px] z-10">
        <MyJuristLogoWithWordmark
          variant="dark"
          size={65}
          wordmarkWidth={213}
          wordmarkHeight={65}
          href="/"
        />
      </div>

      <div className="absolute left-[18.72%] top-[237px] z-10 w-[608px]">
        <h1 className="bg-gradient-to-r from-[#2563EB] to-[#C026D3] bg-clip-text text-[32px] font-bold leading-[40px] tracking-[-0.3px] text-transparent xl:text-[36px] xl:leading-[44px]">
          Next Generation AI-Powered
          <br />
          Legal Intelligence
        </h1>
      </div>

      <div className="absolute left-[18.72%] top-[365px] z-10 flex max-w-[580px] items-center gap-[12px] rounded-[16px] py-[8px] pr-[16px]">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[8px]">
          <IconSearchDocument className="h-[48px] w-[48px]" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[20px] font-medium leading-[normal] tracking-[-0.4px] text-white">
            Unmatched Legal Due Diligence
          </h3>
          <p className="text-[16px] font-normal leading-[22px] tracking-[-0.18px] text-slate-400">
            AI-powered analysis for comprehensive legal research and patent intelligence.
          </p>
        </div>
      </div>

      <div className="absolute left-[27.47%] top-[477px] z-10 flex w-[394px] items-center gap-[12px] rounded-[16px] py-[8px] pr-[16px]">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[8px]">
          <IconLightning className="h-[48px] w-[48px]" />
        </div>
        <div className="flex w-[315px] flex-col gap-[8px]">
          <h3 className="text-[20px] font-medium leading-[normal] tracking-[-0.4px] text-white">
            Lightning Fast Processing
          </h3>
          <p className="text-[16px] font-normal leading-[22px] tracking-[-0.18px] text-slate-400">
            Analyze documents and patents in seconds, not hours.
          </p>
        </div>
      </div>

      <div className="absolute left-[36.11%] top-[589px] z-10 flex w-[394px] items-center gap-[12px] rounded-[16px] py-[8px] pr-[16px]">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[8px]">
          <IconShieldDocument className="h-[48px] w-[48px]" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
          <h3 className="text-[20px] font-medium leading-[normal] tracking-[-0.4px] text-white">
            Uncompromised Privacy
          </h3>
          <p className="text-[16px] font-normal leading-[22px] tracking-[-0.18px] text-slate-400">
            Your sensitive legal documents stay secure and private.
          </p>
        </div>
      </div>

      <p className="absolute left-[48%] top-[788px] z-10 w-[337px] text-[14px] font-normal leading-[20px] tracking-[-0.16px] text-slate-400">
        Join thousands of legal professionals who trust My Jurist for their AI-powered legal research
        needs.
      </p>
    </div>
  );
}
