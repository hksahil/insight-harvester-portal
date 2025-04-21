
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

const products = [
  { label: 'PowerBI Application', key: 'powerbi' },
  { label: 'PowerBI Assistant', key: 'assistant' },
  { label: 'DAX Studio', key: 'dax' },
  { label: 'Tabular Editor', key: 'tabular' },
];

const features = [
  {
    name: 'Web-Based Platform - No installation required',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Cloud-Hosted Access',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Compliance friendly - Works without underlying data',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'One Click Documentation',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Automated Impact Analysis',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Shareable Snippet Library',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Power Query Analyzer',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Data Model Health Score',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Al-Powered Insights',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
];

const PricingComparison = () => {
  return (
    <div className="py-12 px-2 md:px-8">
      <h2 className="text-3xl md:text-4xl font-semibold mb-8 md:mb-12 text-center">Compare Editions</h2>
      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[32%]"></TableHead>
              {products.map((product) => (
                <TableHead 
                  key={product.key} 
                  className={`text-center text-base font-bold ${product.key === 'assistant' ? 'bg-sky-50' : ''}`}
                >
                  {product.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature, rowIdx) => (
              <TableRow key={rowIdx} className="hover:bg-muted/40">
                <TableCell className="font-medium">{feature.name}</TableCell>
                {products.map((product) => {
                  const value = feature[product.key];
                  return (
                    <TableCell 
                      className={`text-center ${product.key === 'assistant' ? 'bg-sky-50' : ''}`} 
                      key={product.key}
                    >
                      {value ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PricingComparison;
