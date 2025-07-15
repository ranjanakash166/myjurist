import React from 'react';
import { Shield, Zap, Lock, Globe } from 'lucide-react';

export default function CompanyInfo() {
  return (
    <div className="flex-1 bg-gradient-to-br from-ai-blue-600 via-ai-purple-600 to-ai-blue-800 p-8 md:p-12 flex flex-col justify-center">
      <div className="max-w-md mx-auto text-center md:text-left">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Jurist
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Next Generation AI-Powered Legal Intelligence
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Unmatched Legal Due Diligence
              </h3>
              <p className="text-blue-100">
                AI-powered analysis for comprehensive legal research and patent intelligence.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Lightning Fast Processing
              </h3>
              <p className="text-blue-100">
                Analyze documents and patents in seconds, not hours.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Uncompromised Privacy
              </h3>
              <p className="text-blue-100">
                Your sensitive legal documents stay secure and private.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Global Patent Intelligence
              </h3>
              <p className="text-blue-100">
                Access to worldwide patent databases and legal precedents.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20">
          <p className="text-blue-100 text-sm">
            Join thousands of legal professionals who trust My Jurist for their AI-powered legal research needs.
          </p>
        </div>
      </div>
    </div>
  );
} 