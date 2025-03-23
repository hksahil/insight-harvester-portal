
import { ProcessedData } from '@/services/VpaxProcessor';

export type RuleCategory = 'maintenance' | 'dax' | 'naming' | 'modeling' | 'formatting' | 'report' | 'performance' | 'error-prevention';

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  check: (data: ProcessedData) => {
    passed: boolean;
    affectedObjects?: string[];
  };
}

export interface CategoryResult {
  category: RuleCategory;
  displayName: string;
  totalRules: number;
  passedRules: number;
  failedRules: number;
  rules: Rule[];
  results: Record<string, {
    passed: boolean;
    affectedObjects?: string[];
  }>;
}

export interface AnalysisResult {
  totalRules: number;
  passedRules: number;
  failedRules: number;
  categories: CategoryResult[];
}

// Define all the rules here
const rules: Rule[] = [
  // Maintenance rules
  {
    id: 'meaningful-table-names',
    name: 'Use meaningful table names',
    description: 'Table names should be descriptive and avoid generic terms like "Table" or numbers.',
    category: 'maintenance',
    check: (data: ProcessedData) => {
      const badNames = data.tableData
        .filter(t => 
          /^Table(\d+)?$/i.test(t['Table Name']) ||
          /^New Table(\d+)?$/i.test(t['Table Name']) ||
          t['Table Name'].length < 3
        )
        .map(t => t['Table Name']);
      
      return {
        passed: badNames.length === 0,
        affectedObjects: badNames
      };
    }
  },
  {
    id: 'meaningful-column-names',
    name: 'Use meaningful column names',
    description: 'Column names should be descriptive and avoid generic terms like "Column" or numbers.',
    category: 'maintenance',
    check: (data: ProcessedData) => {
      const badNames = data.columnData
        .filter(c => 
          /^Column(\d+)?$/i.test(c.ColumnName) ||
          /^New Column(\d+)?$/i.test(c.ColumnName) ||
          c.ColumnName.length < 3
        )
        .map(c => c.FullColumnName || `${c.TableName}[${c.ColumnName}]`);
      
      return {
        passed: badNames.length === 0,
        affectedObjects: badNames
      };
    }
  },
  {
    id: 'meaningful-measure-names',
    name: 'Use meaningful measure names',
    description: 'Measure names should be descriptive and avoid generic terms like "Measure" or numbers.',
    category: 'maintenance',
    check: (data: ProcessedData) => {
      const badNames = data.measureData
        .filter(m => 
          /^Measure(\d+)?$/i.test(m.MeasureName) ||
          /^New Measure(\d+)?$/i.test(m.MeasureName) ||
          m.MeasureName.length < 3
        )
        .map(m => m.FullMeasureName || `${m.TableName}[${m.MeasureName}]`);
      
      return {
        passed: badNames.length === 0,
        affectedObjects: badNames
      };
    }
  },
  {
    id: 'measure-description',
    name: 'Add descriptions to measures',
    description: 'Measures should have descriptions to help users understand their purpose.',
    category: 'maintenance',
    check: (data: ProcessedData) => {
      const measuresWithoutDesc = data.measureData
        .filter(m => !m.Description || m.Description.trim() === '')
        .map(m => m.FullMeasureName || `${m.TableName}[${m.MeasureName}]`);
      
      return {
        passed: measuresWithoutDesc.length === 0,
        affectedObjects: measuresWithoutDesc
      };
    }
  },
  
  // DAX rules
  {
    id: 'complex-measures',
    name: 'Avoid overly complex measures',
    description: 'Measures with very long expressions can be difficult to maintain and understand.',
    category: 'dax',
    check: (data: ProcessedData) => {
      const complexMeasures = data.measureData
        .filter(m => m.MeasureExpression && m.MeasureExpression.length > 500)
        .map(m => m.FullMeasureName || `${m.TableName}[${m.MeasureName}]`);
      
      return {
        passed: complexMeasures.length === 0,
        affectedObjects: complexMeasures
      };
    }
  },
  {
    id: 'nested-calcuations',
    name: 'Avoid deeply nested calculations',
    description: 'Deeply nested CALCULATE functions can cause performance issues and are difficult to read.',
    category: 'dax',
    check: (data: ProcessedData) => {
      const deeplyNested = data.measureData
        .filter(m => {
          const expr = m.MeasureExpression || '';
          const calculateMatches = expr.match(/CALCULATE\s*\(/gi);
          return calculateMatches && calculateMatches.length > 3;
        })
        .map(m => m.FullMeasureName || `${m.TableName}[${m.MeasureName}]`);
      
      return {
        passed: deeplyNested.length === 0,
        affectedObjects: deeplyNested
      };
    }
  },
  
  // Naming rules
  {
    id: 'consistent-naming',
    name: 'Use consistent naming conventions',
    description: 'Tables, columns, and measures should follow consistent naming patterns.',
    category: 'naming',
    check: (data: ProcessedData) => {
      // This is a simplified check - it just looks for mixed case patterns
      const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/;
      const pascalCasePattern = /^[A-Z][a-zA-Z0-9]*$/;
      
      const inconsistentNames: string[] = [];
      
      // Sample a few table names to determine the convention
      const tableNames = data.tableData.slice(0, 5).map(t => t['Table Name']);
      const tableCamelCase = tableNames.filter(name => camelCasePattern.test(name)).length;
      const tablePascalCase = tableNames.filter(name => pascalCasePattern.test(name)).length;
      
      const tableConvention = tableCamelCase > tablePascalCase ? 'camel' : 'pascal';
      
      // Check if tables follow the convention
      data.tableData.forEach(table => {
        const name = table['Table Name'];
        if ((tableConvention === 'camel' && !camelCasePattern.test(name)) ||
            (tableConvention === 'pascal' && !pascalCasePattern.test(name))) {
          inconsistentNames.push(`Table: ${name}`);
        }
      });
      
      return {
        passed: inconsistentNames.length === 0,
        affectedObjects: inconsistentNames
      };
    }
  },
  
  // Modeling rules
  {
    id: 'hidden-measures-in-folder',
    name: 'Put hidden measures in display folders',
    description: 'Measures that are meant to be hidden or used as intermediates should be put into a display folder.',
    category: 'modeling',
    check: (data: ProcessedData) => {
      const withoutFolder = data.measureData
        .filter(m => !m.DisplayFolder || m.DisplayFolder.trim() === '')
        .map(m => m.FullMeasureName || `${m.TableName}[${m.MeasureName}]`);
      
      return {
        passed: withoutFolder.length === 0,
        affectedObjects: withoutFolder
      };
    }
  },
  {
    id: 'query-folding-enabled',
    name: 'Enable query folding for all tables',
    description: 'Query folding should be enabled for all tables to improve performance.',
    category: 'modeling',
    check: (data: ProcessedData) => {
      const tablesWithoutFolding = data.expressionData
        .filter(e => {
          const expression = e.Expression || '';
          return expression.includes('EnableFolding') && !expression.includes('EnableFolding=true');
        })
        .map(e => e['Table Name']);
      
      return {
        passed: tablesWithoutFolding.length === 0,
        affectedObjects: tablesWithoutFolding
      };
    }
  },
  {
    id: 'reduce-high-cardinality',
    name: 'Reduce cardinality of big columns',
    description: 'High cardinality columns (datetime, double, etc.) should be optimized to reduce memory usage.',
    category: 'modeling',
    check: (data: ProcessedData) => {
      const highCardinalityColumns = data.columnData
        .filter(c => {
          const isHighCardinalityType = ['DateTime', 'Double', 'Decimal'].includes(c.DataType);
          const isLargeSize = c.TotalSize && c.TotalSize > 1000000; // 1MB
          return isHighCardinalityType && isLargeSize;
        })
        .map(c => c.FullColumnName || `${c.TableName}[${c.ColumnName}]`);
      
      return {
        passed: highCardinalityColumns.length === 0,
        affectedObjects: highCardinalityColumns
      };
    }
  },
  
  // Formatting rules
  {
    id: 'consistent-format-strings',
    name: 'Use consistent format strings',
    description: 'Format strings for similar measure types should be consistent.',
    category: 'formatting',
    check: (data: ProcessedData) => {
      const percentMeasures = data.measureData.filter(m => 
        m.MeasureName.toLowerCase().includes('percent') || 
        m.MeasureName.toLowerCase().includes('pct') ||
        m.MeasureName.toLowerCase().includes('%')
      );
      
      const formatStrings = new Set(percentMeasures.map(m => m.FormatString));
      const inconsistentPercent = formatStrings.size > 1;
      
      return {
        passed: !inconsistentPercent,
        affectedObjects: inconsistentPercent ? percentMeasures.map(m => `${m.TableName}[${m.MeasureName}]`) : []
      };
    }
  },
  
  // Report rules
  {
    id: 'avoid-hidden-tables',
    name: 'Avoid using hidden tables for visualization',
    description: 'Hidden tables should only be used for calculation purposes, not for direct visualization.',
    category: 'report',
    check: (data: ProcessedData) => {
      const hiddenTables = data.tableData
        .filter(t => t['Is Hidden'] === true)
        .map(t => t['Table Name']);
      
      return {
        passed: hiddenTables.length === 0,
        affectedObjects: hiddenTables
      };
    }
  },
  
  // Performance rules
  {
    id: 'limit-relationship-count',
    name: 'Limit the number of relationships',
    description: 'Having too many relationships can impact performance.',
    category: 'performance',
    check: (data: ProcessedData) => {
      const relationshipCount = data.relationships.length;
      const passed = relationshipCount <= 30;
      
      return {
        passed,
        affectedObjects: passed ? [] : [`${relationshipCount} relationships exceed the recommended limit of 30`]
      };
    }
  },
  {
    id: 'avoid-many-to-many',
    name: 'Avoid many-to-many relationships',
    description: 'Many-to-many relationships can cause performance issues and unexpected results.',
    category: 'performance',
    check: (data: ProcessedData) => {
      const manyToMany = data.relationships
        .filter(r => r.cardinality && r.cardinality.startsWith('M-M'))
        .map(r => `${r.FromTableName} to ${r.ToTableName}`);
      
      return {
        passed: manyToMany.length === 0,
        affectedObjects: manyToMany
      };
    }
  },
  
  // Error prevention
  {
    id: 'data-types-match-in-relationships',
    name: 'Data types should match in relationships',
    description: 'Column data types in relationships should match to prevent conversion issues.',
    category: 'error-prevention',
    check: (data: ProcessedData) => {
      const mismatches: string[] = [];
      
      data.relationships.forEach(rel => {
        const fromCol = data.columnData.find(c => 
          c.TableName === rel.FromTableName && 
          c.ColumnName === rel.FromColumn
        );
        
        const toCol = data.columnData.find(c => 
          c.TableName === rel.ToTableName && 
          c.ColumnName === rel.ToColumn
        );
        
        if (fromCol && toCol && fromCol.DataType !== toCol.DataType) {
          mismatches.push(`${fromCol.TableName}[${fromCol.ColumnName}](${fromCol.DataType}) to ${toCol.TableName}[${toCol.ColumnName}](${toCol.DataType})`);
        }
      });
      
      return {
        passed: mismatches.length === 0,
        affectedObjects: mismatches
      };
    }
  }
];

export function analyzeModel(data: ProcessedData): AnalysisResult {
  const categoryResults: Record<RuleCategory, CategoryResult> = {
    'maintenance': {
      category: 'maintenance',
      displayName: 'Maintenance',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    },
    'dax': {
      category: 'dax',
      displayName: 'DAX Quality',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    },
    'naming': {
      category: 'naming',
      displayName: 'Naming Conventions',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    },
    'modeling': {
      category: 'modeling',
      displayName: 'Modeling Best Practices',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    },
    'formatting': {
      category: 'formatting',
      displayName: 'Formatting',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    },
    'report': {
      category: 'report',
      displayName: 'Reporting',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    },
    'performance': {
      category: 'performance',
      displayName: 'Performance',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    },
    'error-prevention': {
      category: 'error-prevention',
      displayName: 'Error Prevention',
      totalRules: 0,
      passedRules: 0,
      failedRules: 0,
      rules: [],
      results: {}
    }
  };
  
  let totalRules = 0;
  let passedRules = 0;
  
  // Group rules by category and run checks
  rules.forEach(rule => {
    const category = rule.category;
    const result = rule.check(data);
    
    categoryResults[category].rules.push(rule);
    categoryResults[category].results[rule.id] = result;
    categoryResults[category].totalRules++;
    totalRules++;
    
    if (result.passed) {
      categoryResults[category].passedRules++;
      passedRules++;
    } else {
      categoryResults[category].failedRules++;
    }
  });
  
  const categoriesArray = Object.values(categoryResults).filter(cat => cat.totalRules > 0);
  
  return {
    totalRules,
    passedRules,
    failedRules: totalRules - passedRules,
    categories: categoriesArray
  };
}
