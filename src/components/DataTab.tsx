
import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeColumns, setActiveColumns] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [openFilterDropdowns, setOpenFilterDropdowns] = useState<Record<string, boolean>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Calculate PctOfTotalSize for columns if TotalSize exists
  const processedData = useMemo(() => {
    if (data.length === 0) return [];
    
    // For columns data, calculate PctOfTotalSize
    if (data[0].hasOwnProperty('TotalSize')) {
      const totalSizeSum = data.reduce((sum, item) => sum + (item.TotalSize || 0), 0);
      
      return data.map(item => ({
        ...item,
        PctOfTotalSize: totalSizeSum > 0 
          ? `${((item.TotalSize || 0) / totalSizeSum * 100).toFixed(2)}%` 
          : '0%'
      }));
    }
    
    return data;
  }, [data]);
  
  // Get all available columns
  const allColumns = useMemo(() => {
    if (processedData.length === 0) return [];
    // Remove Lineage Tag from columns
    return Object.keys(processedData[0]).filter(col => col !== "Lineage Tag");
  }, [processedData]);
  
  // Set active columns on first render
  useMemo(() => {
    if (activeColumns.length === 0 && processedData.length > 0) {
      // Initialize with all columns except Lineage Tag
      setActiveColumns(Object.keys(processedData[0]).filter(col => col !== "Lineage Tag"));
    }
  }, [processedData, activeColumns.length]);

  // Get additional filters based on data
  const availableFilters = useMemo(() => {
    if (processedData.length === 0) return {};
    
    const filters: Record<string, string[]> = {};
    
    // Add Table Name filter for tables, columns, and measures metadata
    if (processedData[0].hasOwnProperty('TableName')) {
      const tableNames = Array.from(new Set(processedData.map(item => item.TableName))).filter(Boolean).sort();
      filters['TableName'] = tableNames as string[];
    }
    
    if (processedData[0].hasOwnProperty('Table Name')) {
      const tableNames = Array.from(new Set(processedData.map(item => item['Table Name']))).filter(Boolean).sort();
      filters['Table Name'] = tableNames as string[];
    }
    
    // Add Column Name filter for columns metadata
    if (processedData[0].hasOwnProperty('ColumnName')) {
      const columnNames = Array.from(new Set(processedData.map(item => item.ColumnName))).filter(Boolean).sort();
      filters['ColumnName'] = columnNames as string[];
    }
    
    return filters;
  }, [processedData]);

  // Get unique values for each filter column
  const filterOptions: Record<string, string[]> = {};
  filterColumns.forEach(column => {
    const uniqueValues = Array.from(new Set(processedData.map(item => item[column]))).filter(Boolean);
    filterOptions[column] = uniqueValues as string[];
  });

  // Create a filtered version of the data
  const filteredData = useMemo(() => {
    // First filter the data
    let result = processedData.filter(item => {
      // Apply filters
      for (const [key, values] of Object.entries(filters)) {
        if (values && values.length > 0) {
          if (!values.includes(item[key]?.toString())) {
            return false;
          }
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
    
    // Then sort the data if sorting is configured
    if (sortConfig !== null) {
      result = [...result].sort((a, b) => {
        // Handle numeric values
        if (!isNaN(Number(a[sortConfig.key])) && !isNaN(Number(b[sortConfig.key]))) {
          return sortConfig.direction === 'asc' 
            ? Number(a[sortConfig.key]) - Number(b[sortConfig.key])
            : Number(b[sortConfig.key]) - Number(a[sortConfig.key]);
        }
        
        // Handle string values
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [processedData, filters, searchQuery, searchColumn, sortConfig]);

  const resetFilters = () => {
    setFilters({});
    setSearchQuery("");
    setSortConfig(null);
  };

  const toggleColumn = (column: string) => {
    if (activeColumns.includes(column)) {
      setActiveColumns(activeColumns.filter(col => col !== column));
    } else {
      setActiveColumns([...activeColumns, column]);
    }
  };

  const toggleFilter = (column: string, value: string) => {
    const currentValues = filters[column] || [];
    
    if (currentValues.includes(value)) {
      // Remove value if already selected
      setFilters({
        ...filters,
        [column]: currentValues.filter(v => v !== value)
      });
    } else {
      // Add value if not already selected
      setFilters({
        ...filters,
        [column]: [...currentValues, value]
      });
    }
  };

  const toggleFilterDropdown = (column: string) => {
    setOpenFilterDropdowns({
      ...openFilterDropdowns,
      [column]: !openFilterDropdowns[column]
    });
  };

  // Handle column sort
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      // If already sorted descending, remove sort
      setSortConfig(null);
      return;
    }
    
    setSortConfig({ key, direction });
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
        
        {/* Multi-select Filters */}
        {filterColumns.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {filterColumns.map((column) => (
              <div key={column} className="relative">
                <button
                  onClick={() => toggleFilterDropdown(column)}
                  className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between gap-2"
                >
                  <span>{column}</span>
                  <span className="text-xs text-muted-foreground">
                    {filters[column]?.length ? `(${filters[column].length})` : '(All)'}
                  </span>
                </button>
                
                {openFilterDropdowns[column] && (
                  <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-background border border-input rounded-md shadow-lg">
                    <div className="p-2 border-b border-border">
                      <Label className="text-xs font-medium text-muted-foreground">Select {column}</Label>
                    </div>
                    <div className="p-2 space-y-1">
                      {filterOptions[column]?.map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${column}-${value}`} 
                            checked={filters[column]?.includes(value) || false}
                            onCheckedChange={() => toggleFilter(column, value)}
                          />
                          <Label 
                            htmlFor={`${column}-${value}`}
                            className="text-sm cursor-pointer"
                          >
                            {value}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Additional Multi-select Filters */}
        {Object.keys(availableFilters).length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {Object.entries(availableFilters).map(([column, values]) => (
              <div key={column} className="relative">
                <button
                  onClick={() => toggleFilterDropdown(column)}
                  className="bg-background border border-input rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between gap-2"
                >
                  <span>{column}</span>
                  <span className="text-xs text-muted-foreground">
                    {filters[column]?.length ? `(${filters[column].length})` : '(All)'}
                  </span>
                </button>
                
                {openFilterDropdowns[column] && (
                  <div className="absolute z-50 mt-1 w-64 max-h-60 overflow-y-auto bg-background border border-input rounded-md shadow-lg">
                    <div className="p-2 border-b border-border">
                      <Label className="text-xs font-medium text-muted-foreground">Select {column}</Label>
                    </div>
                    <div className="p-2 space-y-1">
                      {values.map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${column}-${value}`} 
                            checked={filters[column]?.includes(value) || false}
                            onCheckedChange={() => toggleFilter(column, value)}
                          />
                          <Label 
                            htmlFor={`${column}-${value}`}
                            className="text-sm cursor-pointer"
                          >
                            {value}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                {processedData.length > 0 && activeColumns.map((key) => (
                  <TableHead 
                    key={key} 
                    className="whitespace-nowrap cursor-pointer hover:bg-muted/60"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center gap-1">
                      {key}
                      {sortConfig?.key === key && (
                        sortConfig.direction === 'asc' 
                          ? <ChevronUp className="h-3 w-3" /> 
                          : <ChevronDown className="h-3 w-3" />
                      )}
                    </div>
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
