
import React, { useState } from 'react';
import { Send, Brain, Database } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface TableColumn {
  tableName: string;
  columnName: string;
  selected: boolean;
}

const AskGPT: React.FC<{
  tableData?: any[];
  columnData?: any[];
}> = ({ tableData = [], columnData = [] }) => {
  const [question, setQuestion] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [tableColumns, setTableColumns] = useState<TableColumn[]>([]);
  
  // Process column data when selected tables change
  React.useEffect(() => {
    if (columnData && columnData.length > 0 && selectedTables.length > 0) {
      const filteredColumns = columnData
        .filter(col => selectedTables.includes(col.TableName))
        .map(col => ({
          tableName: col.TableName,
          columnName: col.ColumnName,
          selected: false
        }));
      setTableColumns(filteredColumns);
    } else {
      setTableColumns([]);
    }
  }, [selectedTables, columnData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (!apiKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }
    
    // Get selected tables and columns for context
    const selectedColumns = tableColumns.filter(col => col.selected);
    
    if (selectedColumns.length === 0 && selectedTables.length > 0) {
      toast.error('Please select at least one column');
      return;
    }
    
    // Create context for GPT
    const context = selectedColumns.length > 0 
      ? `Model context: Tables [${selectedTables.join(', ')}] with columns: ${selectedColumns.map(col => `${col.tableName}.${col.columnName}`).join(', ')}`
      : 'Using full model context';
    
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setAnswer(`This is a simulated response based on your question about the Power BI model.\n\n${context}\n\nIn a real implementation, this would call the OpenAI API with your question and the selected model data to provide targeted insights.`);
      setIsLoading(false);
      toast.success('Response generated');
    }, 1500);
  };
  
  const toggleColumnSelection = (tableName: string, columnName: string) => {
    setTableColumns(prev => 
      prev.map(col => 
        col.tableName === tableName && col.columnName === columnName
          ? { ...col, selected: !col.selected }
          : col
      )
    );
  };
  
  const handleTableSelection = (value: string) => {
    // For multi-select tables
    const tables = value.split(',');
    setSelectedTables(tables);
  };
  
  // Get unique table names from data
  const uniqueTableNames = tableData && tableData.length > 0 
    ? [...new Set(tableData.map(item => item["Table Name"]))]
    : [];
  
  return (
    <div className="animate-fade-in p-2 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Brain className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-medium">Ask about your Power BI model</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            OpenAI API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        
        <div className="space-y-2 bg-muted/20 p-4 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Focus your question on specific tables/columns</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Select tables and columns to narrow down context and improve AI responses
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Select Tables
              </label>
              <Select 
                onValueChange={handleTableSelection}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select tables..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tables</SelectLabel>
                    {uniqueTableNames.map(tableName => (
                      <SelectItem key={tableName} value={tableName}>
                        {tableName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {tableColumns.length > 0 && (
              <div>
                <label className="text-sm font-medium block mb-2">
                  Select Columns ({selectedTables.join(', ')})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-background rounded-md border border-input">
                  {tableColumns.map((col, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`col-${idx}`}
                        checked={col.selected}
                        onCheckedChange={() => toggleColumnSelection(col.tableName, col.columnName)}
                      />
                      <label 
                        htmlFor={`col-${idx}`}
                        className="text-sm cursor-pointer"
                      >
                        {col.columnName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="question" className="text-sm font-medium">
            Your Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about tables, relationships, measures, etc."
            rows={3}
            className="w-full px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary px-4 py-2 w-full flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Question</span>
            </>
          )}
        </button>
      </form>
      
      {answer && (
        <div className="mt-6 p-6 border border-border rounded-lg bg-card animate-slide-in-right">
          <h3 className="text-lg font-medium mb-2">Response:</h3>
          <div className="text-sm whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

export default AskGPT;
