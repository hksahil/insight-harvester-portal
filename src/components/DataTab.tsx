
import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Info } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DataItem {
  [key: string]: any;
}

interface DataTabProps {
  data: DataItem[];
  title: string;
  filterColumns?: string[];
  searchColumn?: string;
  enableColumnSelection?: boolean;
}

const DataTab: React.FC<DataTabProps> = ({ 
  data, 
  title, 
  filterColumns = [], 
  searchColumn,
  enableColumnSelection = false
}) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeColumns, setActiveColumns] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  
  // Get all available columns
  const allColumns = useMemo(() => {
    if (data.length === 0) return [];
    // Remove Lineage Tag from columns
    return Object.keys(data[0]).filter(col => col !== "Lineage Tag");
  }, [data]);
  
  // Set active columns on first render
  useMemo(() => {
    if (activeColumns.length === 0 && data.length > 0) {
      // Initialize with all columns except Lineage Tag
      setActiveColumns(Object.keys(data[0]).filter(col => col !== "Lineage Tag"));
    }
  }, [data, activeColumns.length]);

  // Get additional filters based on data
  const availableFilters = useMemo(() => {
    if (data.length === 0) return {};
    
    const filters: Record<string, string[]> = {};
    
    // Add Table Name filter for tables, columns, and measures metadata
    if (data[0].hasOwnProperty('TableName')) {
      const tableNames = Array.from(new Set(data.map(item => item.TableName))).filter(Boolean).sort();
      filters['TableName'] = tableNames as string[];
    }
    
    if (data[0].hasOwnProperty('Table Name')) {
      const tableNames = Array.from(new Set(data.map(item => item['Table Name']))).filter(Boolean).sort();
      filters['Table Name'] = tableNames as string[];
    }
    
    // Add Column Name filter for columns metadata
    if (data[0].hasOwnProperty('ColumnName')) {
      const columnNames = Array.from(new Set(data.map(item => item.ColumnName))).filter(Boolean).sort();
      filters['ColumnName'] = columnNames as string[];
    }
    
    return filters;
  }, [data]);

  // Create a filtered version of the data
  const filteredData = data.filter(item => {
    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== "All" && value !== "" && item[key] !== value) {
        return false;
      }
    }
    
    // Apply search if searchColumn is provided
    if (searchQuery && searchColumn && item[searchColumn]) {
      const stringValue = String(item[searchColumn]).toLowerCase();
      if (!stringValue.includes(searchQuery.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });

  // Get unique values for each filter column
  const filterOptions: Record<string, string[]> = {};
  filterColumns.forEach(column => {
    const uniqueValues = Array.from(new Set(data.map(item => item[column]))).filter(Boolean);
    filterOptions[column] = uniqueValues as string[];
  });

  const resetFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const toggleColumn = (column: string) => {
    if (activeColumns.includes(column)) {
      setActiveColumns(activeColumns.filter(col => col !== column));
    } else {
      setActiveColumns([...activeColumns, column]);
    }
  };

  // Check if we should show the size note
  const shouldShowSizeNote = useMemo(() => {
    const sizeColumns = ['Table Size', 'Columns Size', 'DAX Table Size', 'DataSize', 'TotalSize', 'DictionarySize', 'UsedSize', 'UsedSizeFrom'];
    return activeColumns.some(col => sizeColumns.includes(col));
  }, [activeColumns]);

  return (
    <div className="animate-fade-in space-y-4 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">{title}</h2>
          {shouldShowSizeNote && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">All sizes are in bytes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div className="flex gap-2">
          {enableColumnSelection && (
            <button 
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="text-sm bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors"
            >
              {showColumnSelector ? "Hide Columns" : "Show Columns"}
            </button>
          )}
          <button 
            onClick={resetFilters} 
            className="text-sm text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center pb-4">
        {/* Search input */}
        {searchColumn && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
          </div>
        )}
        
        {/* Standard Filters */}
        {filterColumns.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filterColumns.map((column) => (
              <select
                key={column}
                value={filters[column] || "All"}
                onChange={(e) => setFilters({...filters, [column]: e.target.value})}
                className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              >
                <option value="All">All {column}</option>
                {filterOptions[column]?.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
        
        {/* Additional Filters */}
        {Object.keys(availableFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {Object.entries(availableFilters).map(([column, values]) => (
              <select
                key={column}
                value={filters[column] || "All"}
                onChange={(e) => setFilters({...filters, [column]: e.target.value})}
                className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              >
                <option value="All">All {column}</option>
                {values.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}
      </div>
      
      {/* Column selector */}
      {showColumnSelector && (
        <div className="bg-muted/30 p-4 rounded-md mb-4 border border-border">
          <div className="font-medium mb-2">Select Columns to Display</div>
          <div className="flex flex-wrap gap-2">
            {allColumns.map(column => (
              <div key={column} className="flex items-center">
                <input
                  type="checkbox"
                  id={`col-${column}`}
                  checked={activeColumns.includes(column)}
                  onChange={() => toggleColumn(column)}
                  className="mr-1"
                />
                <Label htmlFor={`col-${column}`} className="text-sm">{column}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {data.length > 0 && activeColumns.map((key) => (
                  <TableHead key={key} className="whitespace-nowrap">
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((item, index) => (
                <TableRow key={index}>
                  {activeColumns.map((key) => (
                    <TableCell key={key} className="whitespace-nowrap">
                      {item[key]?.toString() || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={activeColumns.length} className="text-center py-6 text-muted-foreground">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DataTab;
