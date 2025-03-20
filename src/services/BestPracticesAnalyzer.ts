
import { ProcessedData } from './VpaxProcessor';

export interface Rule {
  id: string;
  name: string;
  description: string;
  category: RuleCategory;
  evaluate: (data: ProcessedData) => RuleResult;
}

export type RuleCategory = 
  | 'maintenance' 
  | 'dax' 
  | 'naming' 
  | 'modeling' 
  | 'formatting' 
  | 'report' 
  | 'performance' 
  | 'error-prevention';

export interface RuleResult {
  passed: boolean;
  details?: string;
  affectedObjects?: string[];
}

export interface CategoryResult {
  category: RuleCategory;
  displayName: string;
  rules: Rule[];
  results: Record<string, RuleResult>;
  totalRules: number;
  passedRules: number;
  failedRules: number;
}

export interface AnalysisResult {
  categories: CategoryResult[];
  totalRules: number;
  passedRules: number;
  failedRules: number;
}

// Maintenance best practices rules
const maintenanceRules: Rule[] = [
  {
    id: 'tables-have-relationships',
    name: 'Ensure tables have relationships',
    description: 'Tables should be connected to at least one other table via relationships',
    category: 'maintenance',
    evaluate: (data: ProcessedData): RuleResult => {
      const tablesWithRelationships = new Set<string>();
      
      data.relationships.forEach(rel => {
        tablesWithRelationships.add(rel.FromTableName);
        tablesWithRelationships.add(rel.ToTableName);
      });
      
      const disconnectedTables = data.tableData
        .filter(table => !tablesWithRelationships.has(table["Table Name"]))
        .map(table => table["Table Name"]);
      
      return {
        passed: disconnectedTables.length === 0,
        details: disconnectedTables.length > 0 
          ? `${disconnectedTables.length} tables have no relationships` 
          : 'All tables have relationships',
        affectedObjects: disconnectedTables
      };
    }
  },
  {
    id: 'objects-have-descriptions',
    name: 'Visible objects have descriptions',
    description: 'All visible columns and measures should have descriptions',
    category: 'maintenance',
    evaluate: (data: ProcessedData): RuleResult => {
      const columnsWithoutDesc = data.columnData
        .filter(col => !col.IsHidden && (!col.Description || col.Description.trim() === ''))
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      const measuresWithoutDesc = data.measureData
        .filter(measure => !measure.Description || measure.Description.trim() === '')
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      const allObjectsWithoutDesc = [...columnsWithoutDesc, ...measuresWithoutDesc];
      
      return {
        passed: allObjectsWithoutDesc.length === 0,
        details: allObjectsWithoutDesc.length > 0 
          ? `${allObjectsWithoutDesc.length} objects have no description` 
          : 'All objects have descriptions',
        affectedObjects: allObjectsWithoutDesc
      };
    }
  },
  {
    id: 'no-unused-datasources',
    name: 'Remove datasources not referenced by any partition',
    description: 'All tables should have at least one partition',
    category: 'maintenance',
    evaluate: (data: ProcessedData): RuleResult => {
      const tablesWithNoPartitions = data.tableData
        .filter(table => table["Partitions"] === 0)
        .map(table => table["Table Name"]);
      
      return {
        passed: tablesWithNoPartitions.length === 0,
        details: tablesWithNoPartitions.length > 0 
          ? `${tablesWithNoPartitions.length} tables have no partitions` 
          : 'All tables have partitions',
        affectedObjects: tablesWithNoPartitions
      };
    }
  },
  {
    id: 'all-objects-have-descriptions',
    name: 'All columns and measures have descriptions',
    description: 'All columns and measures should have descriptions for better documentation',
    category: 'maintenance',
    evaluate: (data: ProcessedData): RuleResult => {
      const columnsWithoutDesc = data.columnData
        .filter(col => !col.Description || col.Description.trim() === '')
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      const measuresWithoutDesc = data.measureData
        .filter(measure => !measure.Description || measure.Description.trim() === '')
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      const allObjectsWithoutDesc = [...columnsWithoutDesc, ...measuresWithoutDesc];
      
      return {
        passed: allObjectsWithoutDesc.length === 0,
        details: allObjectsWithoutDesc.length > 0 
          ? `${allObjectsWithoutDesc.length} objects have no description` 
          : 'All objects have descriptions',
        affectedObjects: allObjectsWithoutDesc
      };
    }
  },
  {
    id: 'display-folders-used',
    name: 'Display folders are used to improve measure organization',
    description: 'Display folders should be used for better organization of measures',
    category: 'maintenance',
    evaluate: (data: ProcessedData): RuleResult => {
      const measuresWithoutFolder = data.measureData
        .filter(measure => !measure.DisplayFolder || measure.DisplayFolder.trim() === '')
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      return {
        passed: measuresWithoutFolder.length === 0,
        details: measuresWithoutFolder.length > 0 
          ? `${measuresWithoutFolder.length} measures have no display folder` 
          : 'All measures use display folders',
        affectedObjects: measuresWithoutFolder
      };
    }
  },
  {
    id: 'measures-in-display-folders',
    name: 'Measures are grouped into Display Folders for organization',
    description: 'All measures should be organized into display folders',
    category: 'maintenance',
    evaluate: (data: ProcessedData): RuleResult => {
      const measuresWithoutFolder = data.measureData
        .filter(measure => !measure.DisplayFolder || measure.DisplayFolder.trim() === '')
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      return {
        passed: measuresWithoutFolder.length === 0,
        details: measuresWithoutFolder.length > 0 
          ? `${measuresWithoutFolder.length} measures have no display folder` 
          : 'All measures are in display folders',
        affectedObjects: measuresWithoutFolder
      };
    }
  }
];

// DAX best practices rules
const daxRules: Rule[] = [
  {
    id: 'no-duplicate-measures',
    name: 'No two measures have same definition',
    description: 'Avoid duplicate measure expressions to prevent maintenance issues',
    category: 'dax',
    evaluate: (data: ProcessedData): RuleResult => {
      const expressionMap = new Map<string, string[]>();
      
      data.measureData.forEach(measure => {
        const expression = measure.MeasureExpression?.trim();
        if (expression) {
          const normalizedExpression = expression.toLowerCase().replace(/\s+/g, ' ');
          const measures = expressionMap.get(normalizedExpression) || [];
          measures.push(`${measure.TableName}.${measure.MeasureName}`);
          expressionMap.set(normalizedExpression, measures);
        }
      });
      
      const duplicates: string[] = [];
      
      expressionMap.forEach((measures, _) => {
        if (measures.length > 1) {
          duplicates.push(...measures);
        }
      });
      
      return {
        passed: duplicates.length === 0,
        details: duplicates.length > 0 
          ? `${duplicates.length / 2} duplicate measure definitions found` 
          : 'No duplicate measure definitions',
        affectedObjects: duplicates
      };
    }
  },
  {
    id: 'use-divide-function',
    name: 'Use the DIVIDE function for division',
    description: 'Use DIVIDE() instead of / for division to handle division by zero',
    category: 'dax',
    evaluate: (data: ProcessedData): RuleResult => {
      const measuresWithDivision = data.measureData
        .filter(measure => {
          const expression = measure.MeasureExpression || '';
          // Look for division operators not in comments and not in DIVIDE function
          const hasDivisionOperator = /[^\/]\/[^\/]/.test(expression.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
          const usesOnlyDivideFunction = !hasDivisionOperator || (hasDivisionOperator && /DIVIDE\s*\(/i.test(expression));
          return !usesOnlyDivideFunction;
        })
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      return {
        passed: measuresWithDivision.length === 0,
        details: measuresWithDivision.length > 0 
          ? `${measuresWithDivision.length} measures use / instead of DIVIDE()` 
          : 'All divisions use DIVIDE()',
        affectedObjects: measuresWithDivision
      };
    }
  },
  {
    id: 'use-treatas-over-intersect',
    name: 'Use TREATAS instead of INTERSECT for virtual relationships',
    description: 'TREATAS is more efficient than INTERSECT for virtual relationships',
    category: 'dax',
    evaluate: (data: ProcessedData): RuleResult => {
      const measuresWithIntersect = data.measureData
        .filter(measure => {
          const expression = measure.MeasureExpression || '';
          return /INTERSECT\s*\(/i.test(expression) && !/TREATAS\s*\(/i.test(expression);
        })
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      return {
        passed: measuresWithIntersect.length === 0,
        details: measuresWithIntersect.length > 0 
          ? `${measuresWithIntersect.length} measures use INTERSECT instead of TREATAS` 
          : 'No measures use INTERSECT',
        affectedObjects: measuresWithIntersect
      };
    }
  },
  {
    id: 'avoid-iferror',
    name: 'Avoid using IFERROR function',
    description: 'IFERROR can mask real issues, use IF(ISERROR()) pattern instead',
    category: 'dax',
    evaluate: (data: ProcessedData): RuleResult => {
      const measuresWithIfError = data.measureData
        .filter(measure => {
          const expression = measure.MeasureExpression || '';
          return /IFERROR\s*\(/i.test(expression);
        })
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      return {
        passed: measuresWithIfError.length === 0,
        details: measuresWithIfError.length > 0 
          ? `${measuresWithIfError.length} measures use IFERROR` 
          : 'No measures use IFERROR',
        affectedObjects: measuresWithIfError
      };
    }
  }
];

// Naming best practices rules
const namingRules: Rule[] = [
  {
    id: 'no-special-characters',
    name: 'Objects should not contain special characters',
    description: 'Table, column, and measure names should not contain special characters',
    category: 'naming',
    evaluate: (data: ProcessedData): RuleResult => {
      const specialCharsRegex = /[^\w\s]/;
      
      const tablesWithSpecialChars = data.tableData
        .filter(table => specialCharsRegex.test(table["Table Name"]))
        .map(table => table["Table Name"]);
      
      const columnsWithSpecialChars = data.columnData
        .filter(col => specialCharsRegex.test(col.ColumnName))
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      const measuresWithSpecialChars = data.measureData
        .filter(measure => specialCharsRegex.test(measure.MeasureName))
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      const allObjectsWithSpecialChars = [
        ...tablesWithSpecialChars, 
        ...columnsWithSpecialChars, 
        ...measuresWithSpecialChars
      ];
      
      return {
        passed: allObjectsWithSpecialChars.length === 0,
        details: allObjectsWithSpecialChars.length > 0 
          ? `${allObjectsWithSpecialChars.length} objects contain special characters` 
          : 'No objects contain special characters',
        affectedObjects: allObjectsWithSpecialChars
      };
    }
  },
  {
    id: 'columns-use-camel-case',
    name: 'Column names use Camel Case consistently',
    description: 'All column names should follow camelCase naming convention',
    category: 'naming',
    evaluate: (data: ProcessedData): RuleResult => {
      // camelCase: first character lowercase, no spaces, words start with uppercase
      const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
      
      const columnsNotCamelCase = data.columnData
        .filter(col => !camelCaseRegex.test(col.ColumnName))
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      return {
        passed: columnsNotCamelCase.length === 0,
        details: columnsNotCamelCase.length > 0 
          ? `${columnsNotCamelCase.length} columns do not use camelCase` 
          : 'All columns use camelCase',
        affectedObjects: columnsNotCamelCase
      };
    }
  },
  {
    id: 'id-columns-naming',
    name: 'ID columns end with _ID or _Key',
    description: 'Columns containing IDs should end with _ID or _Key',
    category: 'naming',
    evaluate: (data: ProcessedData): RuleResult => {
      const idColumns = data.columnData
        .filter(col => 
          col.ColumnName.includes("ID") || 
          col.ColumnName.includes("Id") || 
          col.ColumnName.includes("id"))
        .filter(col => 
          !col.ColumnName.endsWith("_ID") && 
          !col.ColumnName.endsWith("_Key") && 
          !col.ColumnName.endsWith("_key") && 
          !col.ColumnName.endsWith("_KEY"))
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      return {
        passed: idColumns.length === 0,
        details: idColumns.length > 0 
          ? `${idColumns.length} ID columns do not end with _ID or _Key` 
          : 'All ID columns end with _ID or _Key',
        affectedObjects: idColumns
      };
    }
  },
  {
    id: 'tables-use-singular-nouns',
    name: 'Tables use singular nouns for naming',
    description: 'Table names should use singular nouns instead of plural',
    category: 'naming',
    evaluate: (data: ProcessedData): RuleResult => {
      const pluralRegex = /s$/i;
      
      const tablesWithPluralNames = data.tableData
        .filter(table => pluralRegex.test(table["Table Name"]))
        .map(table => table["Table Name"]);
      
      return {
        passed: tablesWithPluralNames.length === 0,
        details: tablesWithPluralNames.length > 0 
          ? `${tablesWithPluralNames.length} tables use plural nouns` 
          : 'All tables use singular nouns',
        affectedObjects: tablesWithPluralNames
      };
    }
  }
];

// Modeling best practices rules
const modelingRules: Rule[] = [
  {
    id: 'tables-use-partitioning',
    name: 'Partitioning is used to improve refresh performance',
    description: 'Tables should use partitioning for better refresh performance',
    category: 'modeling',
    evaluate: (data: ProcessedData): RuleResult => {
      const tablesWithNoPartitions = data.tableData
        .filter(table => table["Partitions"] === 0)
        .map(table => table["Table Name"]);
      
      return {
        passed: tablesWithNoPartitions.length === 0,
        details: tablesWithNoPartitions.length > 0 
          ? `${tablesWithNoPartitions.length} tables have no partitions` 
          : 'All tables use partitioning',
        affectedObjects: tablesWithNoPartitions
      };
    }
  },
  {
    id: 'avoid-bidirectional-relationships',
    name: 'Avoid bi-directional relationships',
    description: 'CrossFilteringBehavior should be OneDirection to avoid performance issues',
    category: 'modeling',
    evaluate: (data: ProcessedData): RuleResult => {
      const biDirectionalRelationships = data.relationships
        .filter(rel => 
          rel.CrossFilteringBehavior === 'BothDirections' || 
          rel.CrossFilteringBehavior === 'Both' ||
          (rel.cardinality && rel.cardinality.endsWith('B')))
        .map(rel => `${rel.FromTableName} -> ${rel.ToTableName}`);
      
      return {
        passed: biDirectionalRelationships.length === 0,
        details: biDirectionalRelationships.length > 0 
          ? `${biDirectionalRelationships.length} bi-directional relationships found` 
          : 'No bi-directional relationships',
        affectedObjects: biDirectionalRelationships
      };
    }
  },
  {
    id: 'set-isavailableinmdx-false',
    name: 'Set IsAvailableInMDX to false',
    description: 'IsAvailableInMDX should be False for better performance',
    category: 'modeling',
    evaluate: (data: ProcessedData): RuleResult => {
      const columnsWithMdxEnabled = data.columnData
        .filter(col => col.IsAvailableInMDX === true)
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      return {
        passed: columnsWithMdxEnabled.length === 0,
        details: columnsWithMdxEnabled.length > 0 
          ? `${columnsWithMdxEnabled.length} columns have IsAvailableInMDX set to true` 
          : 'All columns have IsAvailableInMDX set to false',
        affectedObjects: columnsWithMdxEnabled
      };
    }
  },
  {
    id: 'avoid-datetime-columns',
    name: 'Split date and time',
    description: 'DateTime columns should be split into separate date and time columns',
    category: 'modeling',
    evaluate: (data: ProcessedData): RuleResult => {
      const dateTimeColumns = data.columnData
        .filter(col => col.DataType === 'DateTime')
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      return {
        passed: dateTimeColumns.length === 0,
        details: dateTimeColumns.length > 0 
          ? `${dateTimeColumns.length} DateTime columns found` 
          : 'No DateTime columns found',
        affectedObjects: dateTimeColumns
      };
    }
  },
  {
    id: 'avoid-many-to-many',
    name: 'Avoid Many to Many relationships',
    description: 'Many to Many relationships can cause performance issues',
    category: 'modeling',
    evaluate: (data: ProcessedData): RuleResult => {
      const manyToManyRelationships = data.relationships
        .filter(rel => 
          (rel.FromCardinalityType === 'Many' && rel.ToCardinalityType === 'Many') ||
          (rel.cardinality && rel.cardinality.startsWith('M-M')))
        .map(rel => `${rel.FromTableName} -> ${rel.ToTableName}`);
      
      return {
        passed: manyToManyRelationships.length === 0,
        details: manyToManyRelationships.length > 0 
          ? `${manyToManyRelationships.length} many-to-many relationships found` 
          : 'No many-to-many relationships',
        affectedObjects: manyToManyRelationships
      };
    }
  }
];

// Formatting best practices rules
const formattingRules: Rule[] = [
  {
    id: 'relationships-use-integer-type',
    name: 'Relationship columns should be of integer data type',
    description: 'For better performance, relationship columns should use integer data types',
    category: 'formatting',
    evaluate: (data: ProcessedData): RuleResult => {
      const relationshipColumnNames = new Set<string>();
      
      data.relationships.forEach(rel => {
        if (rel.FromColumn) relationshipColumnNames.add(`${rel.FromTableName}.${rel.FromColumn}`);
        if (rel.ToColumn) relationshipColumnNames.add(`${rel.ToTableName}.${rel.ToColumn}`);
      });
      
      const nonIntegerRelColumns = data.columnData
        .filter(col => {
          const fullName = `${col.TableName}.${col.ColumnName}`;
          return relationshipColumnNames.has(fullName) && 
                 col.DataType !== 'Integer' && 
                 col.DataType !== 'Int64';
        })
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      return {
        passed: nonIntegerRelColumns.length === 0,
        details: nonIntegerRelColumns.length > 0 
          ? `${nonIntegerRelColumns.length} relationship columns are not integer type` 
          : 'All relationship columns use integer data types',
        affectedObjects: nonIntegerRelColumns
      };
    }
  },
  {
    id: 'capitalize-first-letter',
    name: 'First letter of columns/measures should be capitalized',
    description: 'All columns and measures should start with a capital letter',
    category: 'formatting',
    evaluate: (data: ProcessedData): RuleResult => {
      const nonCapitalizedColumns = data.columnData
        .filter(col => col.ColumnName.length > 0 && col.ColumnName[0] !== col.ColumnName[0].toUpperCase())
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      const nonCapitalizedMeasures = data.measureData
        .filter(measure => measure.MeasureName.length > 0 && measure.MeasureName[0] !== measure.MeasureName[0].toUpperCase())
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      const allNonCapitalized = [...nonCapitalizedColumns, ...nonCapitalizedMeasures];
      
      return {
        passed: allNonCapitalized.length === 0,
        details: allNonCapitalized.length > 0 
          ? `${allNonCapitalized.length} objects don't start with a capital letter` 
          : 'All objects start with a capital letter',
        affectedObjects: allNonCapitalized
      };
    }
  },
  {
    id: 'percentage-format',
    name: 'Percentage should be formatted with thousand separator and 1 decimal',
    description: 'Percentage measures should use proper formatting',
    category: 'formatting',
    evaluate: (data: ProcessedData): RuleResult => {
      const incorrectlyFormattedPercentages = data.measureData
        .filter(measure => {
          // Check if it's a percentage measure (by name or data type)
          const isPercentage = 
            measure.MeasureName.toLowerCase().includes('percent') || 
            measure.MeasureName.toLowerCase().includes('%') ||
            measure.DataType.toLowerCase().includes('percent');
          
          // Check for correct format string (should have '#,0.0%' or similar)
          const hasCorrectFormat = 
            measure.FormatString && 
            measure.FormatString.includes(',') && 
            measure.FormatString.includes('.') && 
            measure.FormatString.includes('%');
          
          return isPercentage && !hasCorrectFormat;
        })
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      return {
        passed: incorrectlyFormattedPercentages.length === 0,
        details: incorrectlyFormattedPercentages.length > 0 
          ? `${incorrectlyFormattedPercentages.length} percentage measures have incorrect formatting` 
          : 'All percentage measures have correct formatting',
        affectedObjects: incorrectlyFormattedPercentages
      };
    }
  },
  {
    id: 'no-trailing-spaces',
    name: 'Objects should not start and end with space',
    description: 'Table, column, and measure names should not have leading or trailing spaces',
    category: 'formatting',
    evaluate: (data: ProcessedData): RuleResult => {
      const tablesWithSpaces = data.tableData
        .filter(table => table["Table Name"] !== table["Table Name"].trim())
        .map(table => table["Table Name"]);
      
      const columnsWithSpaces = data.columnData
        .filter(col => col.ColumnName !== col.ColumnName.trim())
        .map(col => `${col.TableName}.${col.ColumnName}`);
      
      const measuresWithSpaces = data.measureData
        .filter(measure => measure.MeasureName !== measure.MeasureName.trim())
        .map(measure => `${measure.TableName}.${measure.MeasureName}`);
      
      const allObjectsWithSpaces = [...tablesWithSpaces, ...columnsWithSpaces, ...measuresWithSpaces];
      
      return {
        passed: allObjectsWithSpaces.length === 0,
        details: allObjectsWithSpaces.length > 0 
          ? `${allObjectsWithSpaces.length} objects have leading or trailing spaces` 
          : 'No objects have leading or trailing spaces',
        affectedObjects: allObjectsWithSpaces
      };
    }
  }
];

export const allRules: Rule[] = [
  ...maintenanceRules,
  ...daxRules,
  ...namingRules,
  ...modelingRules,
  ...formattingRules
];

export function analyzeModel(data: ProcessedData): AnalysisResult {
  const categoryMap: Record<RuleCategory, {
    displayName: string;
    rules: Rule[];
    results: Record<string, RuleResult>;
    totalRules: number;
    passedRules: number;
    failedRules: number;
  }> = {
    'maintenance': { 
      displayName: 'Maintenance', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    },
    'dax': { 
      displayName: 'DAX Expressions', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    },
    'naming': { 
      displayName: 'Naming Conventions', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    },
    'modeling': { 
      displayName: 'Modeling', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    },
    'formatting': { 
      displayName: 'Formatting', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    },
    'report': { 
      displayName: 'Report', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    },
    'performance': { 
      displayName: 'Performance', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    },
    'error-prevention': { 
      displayName: 'Error Prevention', 
      rules: [], 
      results: {}, 
      totalRules: 0, 
      passedRules: 0, 
      failedRules: 0 
    }
  };
  
  let totalRules = 0;
  let passedRules = 0;
  let failedRules = 0;
  
  // Group rules by category and evaluate each rule
  allRules.forEach(rule => {
    const category = categoryMap[rule.category];
    category.rules.push(rule);
    
    const result = rule.evaluate(data);
    category.results[rule.id] = result;
    
    category.totalRules++;
    if (result.passed) {
      category.passedRules++;
      passedRules++;
    } else {
      category.failedRules++;
      failedRules++;
    }
    
    totalRules++;
  });
  
  // Convert to array of categories
  const categories = Object.entries(categoryMap)
    .filter(([_, category]) => category.rules.length > 0)
    .map(([categoryId, category]) => ({
      category: categoryId as RuleCategory,
      displayName: category.displayName,
      rules: category.rules,
      results: category.results,
      totalRules: category.totalRules,
      passedRules: category.passedRules,
      failedRules: category.failedRules
    }));
  
  return {
    categories,
    totalRules,
    passedRules,
    failedRules
  };
}
