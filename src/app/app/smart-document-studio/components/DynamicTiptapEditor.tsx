'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';

const TiptapEditor = dynamic(() => import('./TiptapEditor').then(mod => ({ default: mod.TiptapEditor })), {
  ssr: false,
  loading: () => (
    <Card className="flex-1 relative overflow-hidden">
      <CardContent className="p-0 h-full relative">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </CardContent>
    </Card>
  )
});

export { TiptapEditor };
