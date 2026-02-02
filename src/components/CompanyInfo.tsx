import React from "react";
import { Shield, Zap, Lock } from "lucide-react";

export default function CompanyInfo() {
  return (
    <div
      className="w-full h-full p-8 md:p-12 flex flex-col justify-center"
      style={{ background: "var(--bg-black-solid, #0f172a)" }}
    >
      <div className="max-w-md mx-auto text-center md:text-left">
        <div className="mb-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "var(--text-on-dark-color, #fff)" }}
          >
            My Jurist
          </h1>
          <p
            className="text-xl mb-6 opacity-90"
            style={{ color: "var(--text-on-dark-color, #fff)" }}
          >
            Next Generation AI-Powered Legal Intelligence
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Shield
                className="w-6 h-6"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              />
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              >
                Unmatched Legal Due Diligence
              </h3>
              <p
                className="opacity-90"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              >
                AI-powered analysis for comprehensive legal research and patent
                intelligence.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Zap
                className="w-6 h-6"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              />
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              >
                Lightning Fast Processing
              </h3>
              <p
                className="opacity-90"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              >
                Analyze documents and patents in seconds, not hours.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Lock
                className="w-6 h-6"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              />
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              >
                Uncompromised Privacy
              </h3>
              <p
                className="opacity-90"
                style={{ color: "var(--text-on-dark-color, #fff)" }}
              >
                Your sensitive legal documents stay secure and private.
              </p>
            </div>
          </div>

        </div>

        <div
          className="mt-12 pt-8 border-t"
          style={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <p
            className="text-sm opacity-90"
            style={{ color: "var(--text-on-dark-color, #fff)" }}
          >
            Join thousands of legal professionals who trust My Jurist for their
            AI-powered legal research needs.
          </p>
        </div>
      </div>
    </div>
  );
} 