
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
    name: 'Works on web, no installations needed',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Works outside client environment',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Works without accessing underlying data',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'One Click documentation',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Impact Analysis',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Sharable code snppet repository',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'PowerQuery Analyser',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'Score your Datamodel against best practices',
    powerbi: false,
    assistant: true,
    dax: false,
    tabular: false,
  },
  {
    name: 'AI Integration',
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
                <TableHead key={product.key} className="text-center text-base font-bold">
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
                    <TableCell className="text-center" key={product.key}>
                      {value ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
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
