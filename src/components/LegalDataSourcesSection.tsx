import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Building2 } from 'lucide-react';

const LegalDataSourcesSection: React.FC = () => {
  const courts = [
    {
      name: 'Supreme Court of India',
      location: 'New Delhi',
      image: '/images/courts/supreme-court.jpg',
      description: 'Access comprehensive case law and judgments from India\'s highest court'
    },
    {
      name: 'High Courts of India',
      location: 'Across India',
      image: '/images/courts/bombay-high-court.jpg', // Using one of the high court images
      description: 'Complete database of all High Court decisions and precedents from across India'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground">
              Connected to Legal Data Sources
            </h2>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-1">
            Access comprehensive legal databases from India's most prestigious courts and legal institutions
          </p>
        </div>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {courts.map((court, index) => (
            <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 group overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                {/* Placeholder icon - shown when image is not available */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <Building2 className="w-16 h-16 text-slate-400 dark:text-slate-600" />
                </div>
                {/* Court image */}
                <img
                  src={court.image}
                  alt={court.name}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  onError={(e) => {
                    // Hide image if it fails to load, showing placeholder instead
                    e.currentTarget.style.display = 'none';
                  }}
                />
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-20"></div>
                {/* Court name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
                  <h3 className="font-bold text-foreground text-lg mb-1">{court.name}</h3>
                  <p className="text-sm text-muted-foreground">{court.location}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {court.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-background rounded-lg border border-border">
            <Scale className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-foreground">
              Continuously updated with latest judgments and legal precedents
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalDataSourcesSection;
