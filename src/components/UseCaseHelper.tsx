
import React from 'react';
import { Lightbulb } from 'lucide-react';

interface UseCaseHelperProps {
  type: 'model-metadata' | 'relationships' | 'tables' | 'columns' | 'measures' | 'expressions';
}

const UseCaseHelper: React.FC<UseCaseHelperProps> = ({ type }) => {
  const useCases = {
    'model-metadata': [
      'View high-level metrics of your Power BI model',
      'Check the model size and number of objects',
      'Analyze model complexity'
    ],
    'relationships': [
      'Understand the data model structure',
      'Check for missing or incorrect relationships',
      'Identify star schema patterns',
      'Detect complex many-to-many relationships'
    ],
    'tables': [
      'Identify large tables that might impact performance',
      'Check for hidden tables that may not be necessary',
      'Analyze table size distribution in the model',
      'Verify import vs. DirectQuery tables'
    ],
    'columns': [
      'Find unused or redundant columns',
      'Check column data types for consistency',
      'Identify columns with high cardinality',
      'Verify proper organization of display folders'
    ],
    'measures': [
      'Verify measures are in the correct display folder',
      'Check if measures have proper formatting',
      'Search for unoptimized DAX patterns',
      'Ensure consistent naming conventions'
    ],
    'expressions': [
      'Find the exact M code of each table',
      'Identify operations performed in Power Query',
      'Check which queries are parameterized',
      'Determine which database or data source is used'
    ]
  };

  return (
    <div className="mb-6 bg-muted/30 p-4 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="font-medium">Use Cases</h3>
      </div>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {useCases[type].map((useCase, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{useCase}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UseCaseHelper;
