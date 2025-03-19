
import React, { useState } from 'react';
import CodeDisplay from './CodeDisplay';

interface ExpressionData {
  'Table Name': string;
  Expression: string;
}

interface ExpressionDisplayProps {
  expressions: ExpressionData[];
}

const ExpressionDisplay: React.FC<ExpressionDisplayProps> = ({ expressions }) => {
  const [selectedTable, setSelectedTable] = useState<string>("All");

  const filteredExpressions = selectedTable === "All" 
    ? expressions.filter(expr => expr.Expression) 
    : expressions.filter(expr => expr['Table Name'] === selectedTable && expr.Expression);

  const tables = ["All", ...Array.from(new Set(expressions.map(expr => expr['Table Name'])))];

  return (
    <div className="animate-fade-in p-2 space-y-4">
      <div className="flex items-center">
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        >
          {tables.map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>
      
      {filteredExpressions.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No expressions found
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExpressions.map((expr, index) => (
            <CodeDisplay
              key={index}
              code={expr.Expression}
              language="m"
              title={expr['Table Name']}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpressionDisplay;
