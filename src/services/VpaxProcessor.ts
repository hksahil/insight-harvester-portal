import { toast } from 'sonner';
import JSZip from 'jszip';

export interface ModelInfo {
  Attribute: string[];
  Value: (string | number | boolean)[];
}

export interface TableData {
  "Table Name": string;
  "Mode": string;
  "Partitions": number;
  "Rows": number | string;
  "Total Table Size": number;
  "Columns Size": number;
  "Relationships Size"?: number;
  "PctOfTotalSize"?: number;
  "Is Hidden": boolean;
  [key: string]: any;
}

export interface ColumnData {
  TableName: string;
  ColumnName: string;
  FullColumnName?: string;
  DataType: string;
  ColumnType?: string;
  IsHidden: boolean;
  Encoding?: string;
  DisplayFolder?: string;
  Description?: string;
  FormatString?: string;
  IsAvailableInMDX?: boolean;
  IsKey?: boolean;
  IsUnique?: boolean;
  IsRowNumber?: boolean;
  DictionarySize?: number;
  DataSize?: number;
  TotalSize?: number;
  PctOfTotalSize?: number;
  IsReferenced?: boolean;
  IsNullable?: boolean;
  ColumnExpression?: string;
  [key: string]: any;
}

export interface MeasureData {
  MeasureName: string;
  TableName: string;
  FullMeasureName?: string;
  MeasureExpression?: string;
  DisplayFolder?: string;
  Description?: string;
  DataType: string;
  FormatString?: string;
  [key: string]: any;
}

export interface ExpressionData {
  "Table Name": string;
  Expression: string;
}

export interface Relationship {
  FromTableName: string;
  FromFullColumnName?: string;
  FromCardinalityType?: string;
  ToTableName: string;
  ToFullColumnName?: string;
  ToCardinalityType?: string;
  JoinOnDateBehavior?: string;
  CrossFilteringBehavior?: string;
  RelationshipType?: string;
  IsActive?: boolean;
  SecurityFilteringBehavior?: string;
  UsedSizeFrom?: number;
  UsedSize?: number;
  MissingKeys?: number;
  InvalidRows?: number;
  cardinality?: string;
  FromColumn?: string;
  ToColumn?: string;
  [key: string]: any;
}

export interface ProcessedData {
  modelInfo: ModelInfo;
  tableData: TableData[];
  columnData: ColumnData[];
  measureData: MeasureData[];
  expressionData: ExpressionData[];
  relationships: Relationship[];
}

export function gbconverter(number: number|undefined) {
  if (number===undefined)
    return undefined;
  const val_in_gb = number / (1024 * 1024 * 1024);
  return `${Math.round(val_in_gb * 100) / 100}GB`;
}

export function dateconverter(date: string|undefined) {
  if (date===undefined)
    return undefined;
  return date.substring(0,10);
}

export async function processVpaxFile(file: File): Promise<ProcessedData> {
  try {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(file);
    
    const fileNames = Object.keys(zipData.files);
    console.log('Files in VPAX package:', fileNames);
    
    let modelName = "Unknown";
    const daxModelFile = zipData.file('DaxModel.json');
    if (daxModelFile) {
      try {
        const daxModelContent = await daxModelFile.async('string');
        const daxModelData = JSON.parse(daxModelContent.replace(/^\uFEFF/, ''));
        if (daxModelData && daxModelData.ModelName) {
          modelName = daxModelData.ModelName;
          console.log('Model name extracted from DaxModel.json:', modelName);
        }
      } catch (e) {
        console.error('Error parsing DaxModel.json:', e);
      }
    }
    
    let modelBimFileObj = zipData.file('model.bim');
    
    if (!modelBimFileObj) {
      const bimFiles = fileNames.filter(name => name.endsWith('.bim'));
      if (bimFiles.length > 0) {
        modelBimFileObj = zipData.file(bimFiles[0]);
        console.log(`Found alternative BIM file: ${bimFiles[0]}`);
      } else {
        const possibleModelFiles = fileNames.filter(name => 
          name.toLowerCase().includes('model') || 
          name.toLowerCase().includes('meta') || 
          name.toLowerCase().includes('schema')
        );
        
        if (possibleModelFiles.length > 0) {
          modelBimFileObj = zipData.file(possibleModelFiles[0]);
          console.log(`Using alternative model file: ${possibleModelFiles[0]}`);
        }
      }
    }
    
    if (!modelBimFileObj) {
      throw new Error('No model.bim or similar file found in the VPAX package. Files found: ' + fileNames.join(', '));
    }
    
    const modelBimContent = await modelBimFileObj.async('string');
    let modelBimData;
    try {
      const cleanedContent = modelBimContent.replace(/^\uFEFF/, '');
      modelBimData = JSON.parse(cleanedContent);
      console.log('Model data parsed successfully');
    } catch (e) {
      console.error('Error parsing model data:', e);
      throw new Error('Failed to parse model data. The file might not be in the expected format.');
    }
    
    let daxVpaViewFileObj = zipData.file('DaxVpaView.json');
    
    if (!daxVpaViewFileObj) {
      const jsonFiles = fileNames.filter(name => 
        name.endsWith('.json') && 
        (name.toLowerCase().includes('dax') || 
         name.toLowerCase().includes('view') || 
         name.toLowerCase().includes('vpa'))
      );
      
      if (jsonFiles.length > 0) {
        daxVpaViewFileObj = zipData.file(jsonFiles[0]);
        console.log(`Found alternative DAX file: ${jsonFiles[0]}`);
      } else {
        const anyJsonFiles = fileNames.filter(name => name.endsWith('.json'));
        if (anyJsonFiles.length > 0) {
          daxVpaViewFileObj = zipData.file(anyJsonFiles[0]);
          console.log(`Using generic JSON file: ${anyJsonFiles[0]}`);
        }
      }
    }
    
    if (!daxVpaViewFileObj) {
      console.warn('No DaxVpaView.json or similar file found. Using default values.');
      
      const { modelInfo, tableData, expressionData } = processModelBim(modelBimData, modelName);
      console.log(modelInfo)
      return {
        modelInfo,
        tableData,
        columnData: [],
        measureData: [],
        expressionData,
        relationships: []
      };
    }
    
    const daxVpaViewContent = await daxVpaViewFileObj.async('string');
    let daxVpaViewData;
    try {
      const cleanedDaxContent = daxVpaViewContent.replace(/^\uFEFF/, '');
      daxVpaViewData = JSON.parse(cleanedDaxContent);
      console.log('DAX data parsed successfully');
    } catch (e) {
      console.error('Error parsing DAX data:', e);
      daxVpaViewData = { Tables: [], Columns: [], Measures: [], Relationships: [] };
    }
    
    const { modelInfo, tableData, expressionData } = processModelBim(modelBimData, modelName);
    
    const { daxTableData, columnData, measureData, relationships } = processDaxVpaView(daxVpaViewData);
    
    const mergedTableData = mergeMetadata(tableData, daxTableData);
    
    // Calculate PctOfTotalSize for columns
    const totalColumnSize = columnData.reduce((sum, column) => sum + (column.TotalSize || 0), 0);
    const columnsWithPct = columnData.map(column => ({
      ...column,
      PctOfTotalSize: totalColumnSize > 0 ? 
        Math.round(((column.TotalSize || 0) / totalColumnSize) * 10000) / 100 : 0
    }));
    
    // Calculate total table size for model info
    const totalTableSize = mergedTableData.reduce((sum, table) => sum + (table["Total Table Size"] || 0), 0);
    
    // Find max row count
    const maxRowCount = Math.max(...mergedTableData.map(table => {
      const rows = typeof table.Rows === 'number' ? table.Rows : 0;
      return rows;
    }));
    
    const relationshipsCount = relationships.length;
    const updatedModelInfo = {
      ...modelInfo,
      Attribute: [...modelInfo.Attribute, "Total Relationships"],
      Value: [
        modelInfo.Value[0], // Model Name
        modelInfo.Value[1], // Date Modified
        gbconverter(totalTableSize) || "Not Available", // Update Total Size of Model
        modelInfo.Value[3], // Number of Tables
        modelInfo.Value[4], // Number of Partitions
        maxRowCount === 0 ? "Not Available" : maxRowCount, // Update Max Row Count
        modelInfo.Value[6], // Total Columns
        modelInfo.Value[7], // Total Measures
        relationshipsCount // Total Relationships
      ]
    };
    
    return {
      modelInfo: updatedModelInfo,
      tableData: mergedTableData,
      columnData: columnsWithPct,
      measureData,
      expressionData,
      relationships
    };
  } catch (error) {
    console.error('Error processing VPAX file:', error);
    toast.error(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

function processModelBim(data: any, extractedModelName: string): { modelInfo: ModelInfo; tableData: TableData[]; expressionData: ExpressionData[] } {
  const tables = data.model?.tables || data.tables || data.Tables || [];
  const { numPartitions, maxRowCount, totalTableSize, tableData, expressionData } = calculateMetadata(tables);
  
  const modelName = extractedModelName !== "Unknown" ? 
                    extractedModelName : 
                    data.name || 
                    data.Name || 
                    data.model?.name || 
                    data.model?.Name || 
                    data.model?.database?.name || 
                    "Unknown";
  
  const modelInfo: ModelInfo = {
    Attribute: ["Model Name", "Date Modified", "Total Size of Model", "Number of Tables", "Number of Partitions", "Max Row Count of Biggest Table", "Total Columns", "Total Measures"],
    Value: [
      modelName,
      dateconverter(data.lastUpdate) || dateconverter(data.LastUpdate) || dateconverter(data.model?.lastUpdate) || "Unknown",
      gbconverter(data.model?.estimatedSize) || gbconverter(data.estimatedSize) || "Not Available",
      tables.length,
      numPartitions,
      maxRowCount === 0 ? "Not Available" : maxRowCount,
      tables.reduce((sum: number, table: any) => sum + (table.columns?.length || table.Columns?.length || 0), 0),
      tables.reduce((sum: number, table: any) => sum + (table.measures?.length || table.Measures?.length || 0), 0)
    ]
  };
  
  return { modelInfo, tableData, expressionData };
}

function calculateMetadata(tables: any[]): { numPartitions: number; maxRowCount: number; totalTableSize: number; tableData: TableData[]; expressionData: ExpressionData[] } {
  let numPartitions = 0;
  let maxRowCount = 0;
  const totalTableSize = tables.reduce((sum, table) => sum + (table.estimatedSize || 0), 0);
  const tableData: TableData[] = [];
  const expressionData: ExpressionData[] = [];
  
  for (const table of tables) {
    const partitions = table.partitions || [];
    numPartitions += partitions.length;
    const tableRowCount = partitions.reduce((sum: number, partition: any) => sum + (partition.rows || 0), 0);
    maxRowCount = Math.max(maxRowCount, tableRowCount);
    
    const expression = partitions.length > 0 && partitions[0].source ? partitions[0].source.expression || "" : "";
    
    const modifiedTime = partitions.length > 0 ? 
                         partitions[0].modifiedTime || 
                         partitions[0].refreshedTime || 
                         "Unknown" : "Unknown";
    
    const refreshedTime = partitions.length > 0 ? 
                         partitions[0].refreshedTime || 
                         partitions[0].modifiedTime || 
                         "Unknown" : "Unknown";
    
    tableData.push({
      "Table Name": table.name || "Unknown",
      "Mode": partitions.length > 0 ? partitions[0].mode || "Unknown" : "Unknown",
      "Partitions": partitions.length,
      "Rows": tableRowCount,
      "Total Table Size": table.estimatedSize || 0,
      "Columns Size": 0, // Adding this to fix the TypeScript error
      "Is Hidden": table.isHidden || false,
      "Latest Partition Modified": modifiedTime,
      "Latest Partition Refreshed": refreshedTime
    });
    
    expressionData.push({
      "Table Name": table.name || "Unknown",
      "Expression": expression
    });
  }
  
  return { numPartitions, maxRowCount, totalTableSize, tableData, expressionData };
}

function processDaxVpaView(data: any): { daxTableData: Record<string, any>; columnData: ColumnData[]; measureData: MeasureData[]; relationships: Relationship[] } {
  const daxTableData: Record<string, any> = {};
  for (const table of data.Tables || []) {
    daxTableData[table.TableName] = table;
  }
  
  const columnData: ColumnData[] = (data.Columns || []).map((column: any) => ({
    TableName: column.TableName || "Unknown",
    ColumnName: column.ColumnName || "Unknown",
    FullColumnName: column.FullColumnName || `${column.TableName || "Unknown"}[${column.ColumnName || "Unknown"}]`,
    DataType: column.DataType || "Unknown",
    ColumnType: column.ColumnType || "Unknown",
    IsHidden: column.IsHidden || false,
    Encoding: column.Encoding || "Unknown",
    DisplayFolder: column.DisplayFolder || "",
    Description: column.Description || "",
    FormatString: column.FormatString || "",
    IsAvailableInMDX: column.IsAvailableInMDX || false,
    IsKey: column.IsKey || false,
    IsUnique: column.IsUnique || false,
    IsRowNumber: column.IsRowNumber || false,
    DictionarySize: column.DictionarySize || 0,
    DataSize: column.DataSize || 0,
    TotalSize: column.TotalSize || 0,
    IsReferenced: column.IsReferenced || false,
    IsNullable: column.IsNullable || false,
    ColumnExpression: column.ColumnExpression || ""
  }));
  
  const measureData: MeasureData[] = (data.Measures || []).map((measure: any) => ({
    MeasureName: measure.MeasureName || "Unknown",
    TableName: measure.TableName || "Unknown",
    FullMeasureName: measure.FullMeasureName || `${measure.TableName || "Unknown"}[${measure.MeasureName || "Unknown"}]`,
    MeasureExpression: measure.MeasureExpression || "",
    DisplayFolder: measure.DisplayFolder || "",
    Description: measure.Description || "",
    DataType: measure.DataType || "Unknown",
    FormatString: measure.FormatString || ""
  }));
  
  const relationships: Relationship[] = (data.Relationships || []).map((rel: any) => {
    const fromCardinality = mapCardinalityToAcronym(rel.FromCardinalityType);
    const toCardinality = mapCardinalityToAcronym(rel.ToCardinalityType);
    const crossFiltering = mapCardinalityToAcronym(rel.CrossFilteringBehavior);
    
    const combinedCardinality = `${fromCardinality}-${toCardinality}-${crossFiltering}`;
    
    return {
      FromTableName: rel.FromTableName || "Unknown",
      FromFullColumnName: rel.FromFullColumnName || "",
      FromCardinalityType: rel.FromCardinalityType || "Unknown",
      ToTableName: rel.ToTableName || "Unknown",
      ToFullColumnName: rel.ToFullColumnName || "",
      ToCardinalityType: rel.ToCardinalityType || "Unknown",
      JoinOnDateBehavior: rel.JoinOnDateBehavior || "Unknown",
      CrossFilteringBehavior: rel.CrossFilteringBehavior || "Unknown",
      RelationshipType: rel.RelationshipType || "Unknown",
      IsActive: rel.IsActive || false,
      SecurityFilteringBehavior: rel.SecurityFilteringBehavior || "Unknown",
      UsedSizeFrom: rel.UsedSizeFrom || 0,
      UsedSize: rel.UsedSize || 0,
      MissingKeys: rel.MissingKeys || 0,
      InvalidRows: rel.InvalidRows || 0,
      cardinality: combinedCardinality,
      FromColumn: rel.FromColumn || rel.FromFullColumnName?.split('[')[1]?.replace(']', '') || "Unknown",
      ToColumn: rel.ToColumn || rel.ToFullColumnName?.split('[')[1]?.replace(']', '') || "Unknown"
    };
  });
  
  return { daxTableData, columnData, measureData, relationships };
}

function mergeMetadata(tableData: TableData[], daxTableData: Record<string, any>): TableData[] {
  const mergedTableData = tableData.map(table => {
    const daxInfo = daxTableData[table["Table Name"]] || {};
    const columnsSize = daxInfo.ColumnsSize || 0;
    const totalTableSize = daxInfo.TableSize || table["Total Table Size"] || 0;
    const relationshipsSize = totalTableSize - columnsSize;
    
    return {
      ...table,
      "Rows": daxInfo.RowsCount !== undefined ? daxInfo.RowsCount : table["Rows"] || "N/A",
      "Columns Size": columnsSize,
      "Total Table Size": totalTableSize,
      "Relationships Size": relationshipsSize > 0 ? relationshipsSize : 0
    };
  });
  
  // Calculate total table size for percentage
  const totalSize = mergedTableData.reduce((sum, table) => sum + (table["Total Table Size"] || 0), 0);
  
  // Add percentage of total size
  return mergedTableData.map(table => ({
    ...table,
    "PctOfTotalSize": totalSize > 0 ? 
      Math.round(((table["Total Table Size"] || 0) / totalSize) * 10000) / 100 : 0
  }));
}

function mapCardinalityToAcronym(cardinalityType: string | undefined): string {
  if (!cardinalityType) return "?";
  
  switch (cardinalityType.toLowerCase()) {
    case "many":
      return "M";
    case "one":
      return "1";
    case "onedirection":
    case "one direction":
    case "single":
      return "S";
    default:
      return cardinalityType.charAt(0).toUpperCase();
  }
}
