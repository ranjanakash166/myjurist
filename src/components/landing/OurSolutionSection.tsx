"use client";

import React from "react";
import { Check } from "lucide-react";

const CARD_WIDTH = 1356;
const CARD_HEIGHT = 564;

const IconLightning: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={44}
    height={64}
    viewBox="0 0 22 32"
    fill="none"
    className="w-11 h-16 shrink-0"
    aria-hidden
  >
    <defs>
      <linearGradient
        id="solution-icon-1"
        x1="11.0004"
        y1="-0.000976563"
        x2="11.0004"
        y2="32.0008"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#C026D3" />
      </linearGradient>
    </defs>
    <path
      d="M17.5024 0.135907C17.6981 0.249384 17.8496 0.425887 17.9321 0.636582C18.0145 0.847277 18.0231 1.07971 17.9564 1.29591L14.3544 12.9999H21.0004C21.1957 12.9998 21.3868 13.0569 21.55 13.1642C21.7132 13.2715 21.8414 13.4242 21.9189 13.6035C21.9963 13.7828 22.0195 13.9809 21.9857 14.1732C21.9518 14.3656 21.8624 14.5438 21.7284 14.6859L5.7284 31.6859C5.57358 31.8505 5.36757 31.9579 5.14395 31.9904C4.92032 32.023 4.69226 31.9788 4.49694 31.8651C4.30162 31.7515 4.15056 31.575 4.06838 31.3645C3.9862 31.154 3.97775 30.9218 4.0444 30.7059L7.6464 18.9999H1.0004C0.805089 19 0.614031 18.9429 0.450811 18.8356C0.287591 18.7283 0.159353 18.5756 0.0819291 18.3963C0.00450516 18.217 -0.0187159 18.019 0.0151323 17.8266C0.0489805 17.6342 0.138416 17.456 0.272399 17.3139L16.2724 0.313907C16.427 0.149505 16.6327 0.0422441 16.856 0.00956402C17.0793 -0.0231161 17.3071 0.0207067 17.5024 0.133907V0.135907Z"
      fill="url(#solution-icon-1)"
    />
  </svg>
);

const IconDocument: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 32 32"
    fill="none"
    className="w-10 h-10 shrink-0"
    aria-hidden
  >
    <defs>
      <linearGradient
        id="solution-icon-2"
        x1="17.3335"
        y1="2.6665"
        x2="17.3335"
        y2="28.6665"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#C026D3" />
      </linearGradient>
    </defs>
    <path
      d="M16 10.1665V2.6665H7.33334C6.80291 2.6665 6.2942 2.87722 5.91913 3.25229C5.54406 3.62736 5.33334 4.13607 5.33334 4.6665V26.6665C5.33334 27.1969 5.54406 27.7056 5.91913 28.0807C6.2942 28.4558 6.80291 28.6665 7.33334 28.6665H24.6667C25.1971 28.6665 25.7058 28.4558 26.0809 28.0807C26.456 27.7056 26.6667 27.1969 26.6667 26.6665V18.9312L20.3293 25.1712C19.9121 25.5817 19.394 25.8751 18.8273 26.0218L16.6713 26.5812C15.43 26.9032 14.2593 26.3092 13.6913 25.3332H9.49201C9.271 25.3332 9.05903 25.2454 8.90275 25.0891C8.74647 24.9328 8.65868 24.7209 8.65868 24.4998C8.65868 24.2788 8.74647 24.0669 8.90275 23.9106C9.05903 23.7543 9.271 23.6665 9.49201 23.6665H13.356C13.3702 23.5554 13.392 23.4436 13.4213 23.3312L13.98 21.1745C14.127 20.6078 14.4206 20.0897 14.8313 19.6725L21.73 12.6665H18.5C17.837 12.6665 17.2011 12.4031 16.7322 11.9343C16.2634 11.4654 16 10.8295 16 10.1665ZM24.9427 9.73184C24.5427 9.92517 24.1693 10.1898 23.8393 10.5245L23.3713 10.9998H18.5C18.04 10.9998 17.6667 10.6265 17.6667 10.1665V2.97584L24.9427 9.73184ZM28.556 11.4452C28.3084 11.1974 28.0141 11.0011 27.6903 10.8676C27.3664 10.7342 27.0193 10.6661 26.669 10.6675C26.3187 10.6689 25.9721 10.7396 25.6493 10.8756C25.3264 11.0116 25.0337 11.2101 24.788 11.4598L15.7807 20.6085C15.5341 20.8586 15.3577 21.1693 15.2693 21.5092L14.7107 23.6658C14.4553 24.6498 15.3513 25.5458 16.3353 25.2905L18.492 24.7312C18.8319 24.643 19.1425 24.4668 19.3927 24.2205L28.5413 15.2132C28.791 14.9675 28.9896 14.6748 29.1256 14.3519C29.2616 14.0291 29.3323 13.6825 29.3337 13.3322C29.335 12.9819 29.267 12.6348 29.1335 12.3109C29.0001 11.9871 28.8038 11.6928 28.556 11.4452Z"
      fill="url(#solution-icon-2)"
    />
  </svg>
);

const IconDocumentAnalysis: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={44}
    viewBox="0 0 26 29"
    fill="none"
    className="w-10 h-11 shrink-0"
    aria-hidden
  >
    <defs>
      <linearGradient
        id="solution-icon-3"
        x1="12.9997"
        y1="0"
        x2="12.9997"
        y2="28.9983"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#C026D3" />
      </linearGradient>
    </defs>
    <path
      d="M7.24942 0H14.9994V7.75C14.9994 8.61195 15.3418 9.4386 15.9513 10.0481C16.5608 10.6576 17.3875 11 18.2494 11H25.9994V24.75C25.9994 25.612 25.657 26.4386 25.0475 27.0481C24.438 27.6576 23.6114 28 22.7494 28H13.3784L14.2594 27.71C14.6343 27.5785 14.9616 27.3383 15.1994 27.02C15.3944 26.715 15.4994 26.361 15.4994 26C15.5003 25.6166 15.3815 25.2425 15.1594 24.93C14.9352 24.6175 14.6213 24.3803 14.2594 24.25H14.1894L13.3194 23.97C13.2688 23.9466 13.2217 23.9164 13.1794 23.88C13.1369 23.8387 13.1058 23.787 13.0894 23.73L12.7894 22.82C12.6579 22.4451 12.4177 22.1178 12.0994 21.88C11.7815 21.6414 11.3968 21.5085 10.9994 21.5H10.9874C10.8354 21.491 10.5674 21.325 10.5104 20.74L10.9994 20.56C11.4367 20.4123 11.8152 20.1285 12.0794 19.75C12.3404 19.385 12.4794 18.948 12.4794 18.5C12.4698 18.0587 12.3259 17.6309 12.0668 17.2735C11.8077 16.9162 11.4458 16.6463 11.0294 16.5H10.9194L9.29942 15.9C9.01295 15.7997 8.75305 15.6356 8.53942 15.42C8.31959 15.2059 8.15489 14.9417 8.05942 14.65L7.51942 13C7.37654 12.5692 7.10159 12.1944 6.7336 11.9287C6.36561 11.663 5.92329 11.52 5.46942 11.52C5.02115 11.5191 4.58391 11.659 4.21942 11.92C4.14276 11.972 4.06942 12.0287 3.99942 12.09V3.25C3.99942 2.38805 4.34183 1.5614 4.95133 0.951903C5.56082 0.34241 6.38747 0 7.24942 0ZM25.0474 7.634C25.4314 8.018 25.7094 8.489 25.8634 9H18.2494C17.5594 9 16.9994 8.44 16.9994 7.75V0.136C17.5153 0.290613 17.9847 0.571017 18.3654 0.952L25.0474 7.634ZM3.48742 20.51C3.86789 20.8936 4.15437 21.3602 4.32442 21.873L4.87242 23.556C4.91779 23.6861 5.00251 23.7989 5.11486 23.8787C5.22721 23.9586 5.36161 24.0014 5.49942 24.0014C5.63724 24.0014 5.77164 23.9586 5.88399 23.8787C5.99633 23.7989 6.08106 23.6861 6.12642 23.556L6.67442 21.873C6.84483 21.3614 7.13211 20.8966 7.51347 20.5154C7.89483 20.1342 8.35978 19.8472 8.87142 19.677L10.5554 19.13C10.6851 19.0842 10.7974 18.9993 10.8768 18.887C10.9562 18.7747 10.9988 18.6405 10.9988 18.503C10.9988 18.3655 10.9562 18.2313 10.8768 18.119C10.7974 18.0067 10.6851 17.9218 10.5554 17.876L10.5214 17.868L8.83742 17.321C8.32578 17.1508 7.86083 16.8638 7.47947 16.4826C7.09811 16.1014 6.81083 15.6366 6.64042 15.125L6.09342 13.442C6.04828 13.3115 5.96357 13.1984 5.85111 13.1183C5.73864 13.0382 5.604 12.9951 5.46592 12.9951C5.32785 12.9951 5.19321 13.0382 5.08074 13.1183C4.96827 13.1984 4.88357 13.3115 4.83842 13.442L4.29142 15.125L4.27742 15.167C4.10629 15.6658 3.82371 16.119 3.45117 16.4923C3.07862 16.8655 2.62591 17.1489 2.12742 17.321L0.443424 17.868C0.313748 17.9138 0.201471 17.9987 0.122058 18.111C0.0426437 18.2233 0 18.3575 0 18.495C0 18.6325 0.0426437 18.7667 0.122058 18.879C0.201471 18.9913 0.313748 19.0762 0.443424 19.122L2.12742 19.668C2.64042 19.839 3.10642 20.128 3.48742 20.51Z"
      fill="url(#solution-icon-3)"
    />
  </svg>
);

const IconCheckCircle: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 32 32"
    fill="none"
    className="w-10 h-10 shrink-0"
    aria-hidden
  >
    <defs>
      <linearGradient
        id="solution-icon-4"
        x1="16"
        y1="2"
        x2="16"
        y2="30"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#C026D3" />
      </linearGradient>
    </defs>
    <path
      d="M28.2325 12.8525C27.7612 12.36 27.2738 11.8525 27.09 11.4062C26.92 10.9975 26.91 10.32 26.9 9.66375C26.8813 8.44375 26.8612 7.06125 25.9 6.1C24.9387 5.13875 23.5562 5.11875 22.3363 5.1C21.68 5.09 21.0025 5.08 20.5938 4.91C20.1488 4.72625 19.64 4.23875 19.1475 3.7675C18.285 2.93875 17.305 2 16 2C14.695 2 13.7162 2.93875 12.8525 3.7675C12.36 4.23875 11.8525 4.72625 11.4062 4.91C11 5.08 10.32 5.09 9.66375 5.1C8.44375 5.11875 7.06125 5.13875 6.1 6.1C5.13875 7.06125 5.125 8.44375 5.1 9.66375C5.09 10.32 5.08 10.9975 4.91 11.4062C4.72625 11.8512 4.23875 12.36 3.7675 12.8525C2.93875 13.715 2 14.695 2 16C2 17.305 2.93875 18.2837 3.7675 19.1475C4.23875 19.64 4.72625 20.1475 4.91 20.5938C5.08 21.0025 5.09 21.68 5.1 22.3363C5.11875 23.5562 5.13875 24.9387 6.1 25.9C7.06125 26.8612 8.44375 26.8813 9.66375 26.9C10.32 26.91 10.9975 26.92 11.4062 27.09C11.8512 27.2738 12.36 27.7612 12.8525 28.2325C13.715 29.0613 14.695 30 16 30C17.305 30 18.2837 29.0613 19.1475 28.2325C19.64 27.7612 20.1475 27.2738 20.5938 27.09C21.0025 26.92 21.68 26.91 22.3363 26.9C23.5562 26.8813 24.9387 26.8612 25.9 25.9C26.8612 24.9387 26.8813 23.5562 26.9 22.3363C26.91 21.68 26.92 21.0025 27.09 20.5938C27.2738 20.1488 27.7612 19.64 28.2325 19.1475C29.0613 18.285 30 17.305 30 16C30 14.695 29.0613 13.7162 28.2325 12.8525ZM21.7075 13.7075L14.7075 20.7075C14.6146 20.8005 14.5043 20.8742 14.3829 20.9246C14.2615 20.9749 14.1314 21.0008 14 21.0008C13.8686 21.0008 13.7385 20.9749 13.6171 20.9246C13.4957 20.8742 13.3854 20.8005 13.2925 20.7075L10.2925 17.7075C10.1996 17.6146 10.1259 17.5043 10.0756 17.3829C10.0253 17.2615 9.99944 17.1314 9.99944 17C9.99944 16.8686 10.0253 16.7385 10.0756 16.6171C10.1259 16.4957 10.1996 16.3854 10.2925 16.2925C10.4801 16.1049 10.7346 15.9994 11 15.9994C11.1314 15.9994 11.2615 16.0253 11.3829 16.0756C11.5043 16.1259 11.6146 16.1996 11.7075 16.2925L14 18.5863L20.2925 12.2925C20.3854 12.1996 20.4957 12.1259 20.6171 12.0756C20.7385 12.0253 20.8686 11.9994 21 11.9994C21.1314 11.9994 21.2615 12.0253 21.3829 12.0756C21.5043 12.1259 21.6146 12.1996 21.7075 12.2925C21.8004 12.3854 21.8741 12.4957 21.9244 12.6171C21.9747 12.7385 22.0006 12.8686 22.0006 13C22.0006 13.1314 21.9747 13.2615 21.9244 13.3829C21.8741 13.5043 21.8004 13.6146 21.7075 13.7075Z"
      fill="url(#solution-icon-4)"
    />
  </svg>
);

const headerStyle = {
  color: "var(--text-primary, #0F172A)",
  fontFamily: "var(--Heading-H3-fontFamily, Inter)",
  fontSize: "var(--Heading-H3-fontSize, 40px)",
  fontStyle: "normal" as const,
  fontWeight: 600,
  lineHeight: "var(--Heading-H3-lineHeight, 48px)",
  letterSpacing: "-0.3px",
};

const subHeaderStyle = {
  color: "var(--text-secondary, #475569)",
  fontFamily: "var(--Heading-H6-fontFamily, Inter)",
  fontSize: "var(--Heading-H6-fontSize, 20px)",
  fontStyle: "normal" as const,
  fontWeight: 600,
  lineHeight: "var(--Heading-H6-lineHeight, 24px)",
  letterSpacing: 0,
};

const listItemStyle = {
  color: "var(--text-primary, #0F172A)",
  fontFamily: "var(--Label-Label-1-fontFamily, Inter)",
  fontSize: "var(--Label-Label-1-fontSize, 16px)",
  fontStyle: "normal" as const,
  fontWeight: 500,
  lineHeight: "var(--Label-Label-1-lineHeight, 22px)",
  letterSpacing: "-0.18px",
};

const cardsData = [
  {
    icon: IconLightning,
    header: "Lightning-Fast Legal Research",
    subHeader:
      "Ask questions in plain English and get relevant Supreme Court and High Court judgments instantly. Our AI understands legal context, not just keywords.",
    list: [
      "Search across 50+ million Indian case laws",
      "Natural language queries (no complex Boolean operators)",
      "Instant citation verification and Shepardizing",
      "Filter by court, year, bench, and practice area",
    ],
  },
  {
    icon: IconDocument,
    header: "Smart Legal Drafting",
    subHeader:
      "Generate court-ready pleadings, notices, and contracts with AI assistance. Start from proven templates or create custom documents that match your style.",
    list: [
      "500+ legal document templates (petitions, notices, contracts)",
      "AI-powered clause suggestions based on case facts",
      "Automatic precedent citation insertion",
      "Export to Word with proper formatting",
    ],
  },
  {
    icon: IconDocumentAnalysis,
    header: "Intelligent Document Analysis",
    subHeader:
      "Upload contracts, agreements, or court orders and get AI-powered insights in seconds. Extract key clauses, identify risks, and understand obligations instantly.",
    list: [
      "Analyze 100+ page documents in under 2 minutes",
      "Automatic clause extraction and categorization",
      "Risk assessment and red flag identification",
      "Multi-document comparison side-by-side",
    ],
  },
  {
    icon: IconCheckCircle,
    header: "Real-Time Compliance Tracking",
    subHeader:
      "Stay ahead of regulatory changes affecting your practice. Get alerts on new amendments, notifications, and relevant statutory updates.",
    list: [
      "Track changes across 200+ Central & State Acts",
      "Personalized alerts for your practice areas",
      "Compliance checklists for common procedures",
      "Automated deadline tracking and reminders",
    ],
  },
];

const OurSolutionSection: React.FC = () => {
  return (
    <section
      id="solutions"
      className="py-20 md:py-24 px-4"
      style={{ background: "var(--bg-tertiary, #F1F5F9)" }}
    >
      <div className="max-w-[1356px] mx-auto">
        <h2
          className="text-center mb-14 font-semibold"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--Heading-H3-fontFamily, Inter)",
            fontSize: "var(--Heading-H3-fontSize, 40px)",
            fontWeight: 600,
            lineHeight: "48px",
            letterSpacing: "-0.3px",
          }}
        >
          Our solution
        </h2>

        {/* Cards laid one after the other; each sticks on scroll so they stack bottom to top */}
        <div className="flex flex-col gap-0">
          {cardsData.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.header}
                className="flex justify-center py-4 md:py-6"
                style={{ minHeight: CARD_HEIGHT + 120 }}
              >
                <div
                  className="w-full max-w-[1356px] rounded-3xl bg-white shadow-xl border border-slate-200/60 overflow-hidden flex flex-col md:flex-row sticky top-4 md:top-8 shrink-0 min-h-[400px] md:min-h-0"
                  style={{
                    width: "100%",
                    height: CARD_HEIGHT,
                    maxWidth: CARD_WIDTH,
                  }}
                >
                  <div className="flex-1 p-6 md:p-10 lg:p-12 flex flex-col justify-center min-w-0">
                    <div className="mb-6">
                      <Icon />
                    </div>
                    <h3 className="mb-4" style={headerStyle}>
                      {card.header}
                    </h3>
                    <p className="mb-6 max-w-xl" style={subHeaderStyle}>
                      {card.subHeader}
                    </p>
                    <ul className="space-y-3">
                      {card.list.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3"
                          style={listItemStyle}
                        >
                          <Check
                            className="w-5 h-5 shrink-0 mt-0.5 text-[var(--blue-600)]"
                            strokeWidth={2.5}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="w-full md:w-[min(50%,658px)] shrink-0 rounded-2xl md:rounded-l-none md:rounded-r-[24px]"
                    style={{
                      width: "min(50%, 658px)",
                      minWidth: 280,
                      height: "100%",
                      minHeight: CARD_HEIGHT,
                      background: "var(--bg-secondary, #F8FAFC)",
                      borderRadius: 24,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurSolutionSection;
