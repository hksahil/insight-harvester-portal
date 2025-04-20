
import React from 'react';
import { Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PricingComparison = () => {
  const features = [
    { name: 'External tool for Power BI Desktop', desktop: true, business: true },
    { name: 'Load/save model meta data to disk ¹', desktop: false, business: true, note: '2' },
    { name: 'Workspace Mode', desktop: false, business: true, note: '2' },
    { name: 'DAX Optimizer access', desktop: false, business: false },
    { name: 'Power BI Premium Per User', desktop: false, business: true },
    { name: 'SQL Server Developer Edition', desktop: false, business: true, note: '2' },
    { name: 'SQL Server Standard Edition', desktop: false, business: true },
    { name: 'SQL Server Enterprise Edition', desktop: false, business: false },
  ];

  return (
    <div className="py-24 px-4">
      <h2 className="text-4xl font-semibold mb-12">Compare editions</h2>
      
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]"></TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center space-y-2">
                  <img 
                    src="public/lovable-uploads/477c7a2e-01f8-419e-9ef0-647351745947.png"
                    alt="Power BI Logo"
                    className="w-12 h-12"
                  />
                  <div className="font-bold text-xl">Desktop</div>
                  <div className="text 2xl font-bold">$10 / monthly</div>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="flex flex-col items-center space-y-2">
                  <img 
                    src="public/lovable-uploads/477c7a2e-01f8-419e-9ef0-647351745947.png"
                    alt="Power BI Logo"
                    className="w-12 h-12"
                  />
                  <div className="font-bold text-xl">Business</div>
                  <div className="text-2xl font-bold">$35 / monthly</div>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell className="text-center">
                  {feature.desktop ? (
                    <Check className="h-5 w-5 mx-auto text-primary" />
                  ) : (
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {feature.business ? (
                    <div className="flex items-center justify-center gap-1">
                      <Check className="h-5 w-5 text-primary" />
                      {feature.note && <span className="text-sm text-muted-foreground">{feature.note}</span>}
                    </div>
                  ) : (
                    <X className="h-5 w-5 mx-auto text-muted-foreground" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PricingComparison;
