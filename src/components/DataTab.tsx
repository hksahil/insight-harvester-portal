
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface DataItem {
  [key: string]: any;
}

interface DataTabProps {
  data: DataItem[];
  title: string;
  filterColumns?: string[];
  searchColumn?: string;
}

const DataTab: React.FC<DataTabProps> = ({ 
  data, 
  title, 
  filterColumns = [], 
  searchColumn 
}) => {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Create a filtered version of the data
  const filteredData = data.filter(item => {
    // Apply filters
    for (const [key, value] of Object.entries(filters)) {
      if (value !== "All" && item[key] !== value) {
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

  return (
    <div className="animate-fade-in space-y-4 p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">{title}</h2>
        <button onClick={resetFilters} className="text-sm text-primary hover:underline">
          Reset filters
        </button>
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
        
        {/* Filters */}
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
      </div>
      
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                {data.length > 0 && Object.keys(data[0]).map((key) => (
                  <th key={key} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  {Object.entries(item).map(([key, value]) => (
                    <td key={key} className="px-4 py-3 text-sm whitespace-nowrap">
                      {value?.toString() || "-"}
                    </td>
                  ))}
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={Object.keys(data[0] || {}).length} className="px-4 py-8 text-center text-muted-foreground">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTab;
