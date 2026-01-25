import React from 'react';
import { Search, FileText, Shield, FileEdit, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProductShowcaseSection: React.FC = () => {
  const products = [
    {
      icon: Search,
      title: 'Legal Research',
      description: 'AI-powered case law and precedent search',
      href: '/app/legal-research',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Upload and analyze legal documents with AI',
      href: '/app/document-analysis',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Regulatory Compliance',
      description: 'Automated compliance checking and guidance',
      href: '/app/regulatory-compliance',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: FileEdit,
      title: 'Smart Document Drafting',
      description: 'AI-powered document creation and generation',
      href: '/app/smart-document-studio',
      gradient: 'from-orange-500 to-amber-600'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Augment All of Your Work on
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            One Integrated, Secure Platform
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <Card key={index} className="border-border hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-2">
                    {product.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {product.description}
                  </p>
                  <Link href={product.href}>
                    <Button variant="ghost" className="group-hover:text-foreground p-0 h-auto font-semibold">
                      Explore {product.title}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
