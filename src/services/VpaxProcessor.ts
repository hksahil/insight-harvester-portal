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
  "Rows": number;
  "Table Size": number;
  "% of Total Size": number;
  "Is Hidden": boolean;
  [key: string]: any;
}

export interface ColumnData {
  TableName: string;
  ColumnName: string;
  DataType: string;
  IsHidden: boolean;
  Format?: string;
  [key: string]: any;
}

export interface MeasureData {
  MeasureName: string;
  TableName: string;
  DataType: string;
  MeasureExpression?: string;
  [key: string]: any;
}

export interface ExpressionData {
  "Table Name": string;
  Expression: string;
}

export interface Relationship {
  FromTableName: string;
  ToTableName: string;
  cardinality: string;
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

export async function processVpaxFile(file: File): Promise<ProcessedData> {
  try {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(file);
    
    // First, list all files in the ZIP to debug
    const fileNames = Object.keys(zipData.files);
    console.log('Files in VPAX package:', fileNames);
    
    // Look for model.bim or similar files with BIM data
    let modelBimFile = zipData.file('model.bim');
    
    // If model.bim not found, try looking for it in subdirectories or with alternative names
    if (!modelBimFile) {
      // Look for any .bim file
      const bimFiles = fileNames.filter(name => name.endsWith('.bim'));
      if (bimFiles.length > 0) {
        modelBimFile = zipData.file(bimFiles[0]);
        console.log(`Found alternative BIM file: ${bimFiles[0]}`);
      } else {
        // Look for files that might contain model data
        const possibleModelFiles = fileNames.filter(name => 
          name.toLowerCase().includes('model') || 
          name.toLowerCase().includes('meta') || 
          name.toLowerCase().includes('schema')
        );
        
        if (possibleModelFiles.length > 0) {
          modelBimFile = zipData.file(possibleModelFiles[0]);
          console.log(`Using alternative model file: ${possibleModelFiles[0]}`);
        }
      }
    }
    
    if (!modelBimFile) {
      throw new Error('No model.bim or similar file found in the VPAX package. Files found: ' + fileNames.join(', '));
    }
    
    // Extract and parse model.bim file or alternative
    const modelBimContent = await modelBimFile.async('string');
    let modelBimData;
    try {
      // Remove BOM character if present
      const cleanedContent = modelBimContent.replace(/^\uFEFF/, '');
      modelBimData = JSON.parse(cleanedContent);
      console.log('Model data parsed successfully');
    } catch (e) {
      console.error('Error parsing model data:', e);
      throw new Error('Failed to parse model data. The file might not be in the expected format.');
    }
    
    // Look for DaxVpaView.json or similar
    let daxVpaViewFile = zipData.file('DaxVpaView.json');
    
    // If not found, try alternatives
    if (!daxVpaViewFile) {
      const jsonFiles = fileNames.filter(name => 
        name.endsWith('.json') && 
        (name.toLowerCase().includes('dax') || 
         name.toLowerCase().includes('view') || 
         name.toLowerCase().includes('vpa'))
      );
      
      if (jsonFiles.length > 0) {
        daxVpaViewFile = zipData.file(jsonFiles[0]);
        console.log(`Found alternative DAX file: ${jsonFiles[0]}`);
      } else {
        // Look for any JSON file if no specific DAX files found
        const anyJsonFiles = fileNames.filter(name => name.endsWith('.json'));
        if (anyJsonFiles.length > 0) {
          daxVpaViewFile = zipData.file(anyJsonFiles[0]);
          console.log(`Using generic JSON file: ${anyJsonFiles[0]}`);
        }
      }
    }
    
    if (!daxVpaViewFile) {
      // If no DAX file found, create dummy data to allow some functionality
      console.warn('No DaxVpaView.json or similar file found. Using default values.');
      
      // Process model.bim data with defaults for DAX data
      const { modelInfo, tableData, expressionData } = processModelBim(modelBimData);
      
      // Create minimal default data
      return {
        modelInfo,
        tableData,
        columnData: [],
        measureData: [],
        expressionData,
        relationships: []
      };
    }
    
    // Extract and parse DaxVpaView.json file or alternative, also handling BOM
    const daxVpaViewContent = await daxVpaViewFile.async('string');
    let daxVpaViewData;
    try {
      // Remove BOM character if present
      const cleanedDaxContent = daxVpaViewContent.replace(/^\uFEFF/, '');
      daxVpaViewData = JSON.parse(cleanedDaxContent);
      console.log('DAX data parsed successfully');
    } catch (e) {
      console.error('Error parsing DAX data:', e);
      daxVpaViewData = { Tables: [], Columns: [], Measures: [], Relationships: [] };
    }
    
    // Process model.bim data
    const { modelInfo, tableData, expressionData } = processModelBim(modelBimData);
    
    // Process DaxVpaView.json data
    const { daxTableData, columnData, measureData, relationships } = processDaxVpaView(daxVpaViewData);
    
    // Merge metadata
    const mergedTableData = mergeMetadata(tableData, daxTableData);
    
    return {
      modelInfo,
      tableData: mergedTableData,
      columnData,
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

function processModelBim(data: any): { modelInfo: ModelInfo; tableData: TableData[]; expressionData: ExpressionData[] } {
  // Handle different possible formats of the model data
  const tables = data.model?.tables || data.tables || data.Tables || [];
  const { numPartitions, maxRowCount, totalTableSize, tableData, expressionData } = calculateMetadata(tables);
  
  const modelInfo: ModelInfo = {
    Attribute: ["Model Name", "Date Modified", "Total Size of Model", "Storage Format", "Number of Tables", "Number of Partitions", "Max Row Count of Biggest Table", "Total Columns", "Total Measures"],
    Value: [
      data.name || data.Name || "Unknown",
      data.lastUpdate || data.LastUpdate || "Unknown",
      data.model?.estimatedSize || data.estimatedSize || "Not Available",
      data.model?.defaultPowerBIDataSourceVersion || data.defaultPowerBIDataSourceVersion || "Unknown",
      tables.length,
      numPartitions,
      maxRowCount,
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
    
    tableData.push({
      "Table Name": table.name || "Unknown",
      "Mode": partitions.length > 0 ? partitions[0].mode || "Unknown" : "Unknown",
      "Partitions": partitions.length,
      "Rows": tableRowCount,
      "Table Size": table.estimatedSize || 0,
      "% of Total Size": totalTableSize > 0 ? Math.round((table.estimatedSize || 0) / totalTableSize * 100 * 100) / 100 : 0,
      "Is Hidden": table.isHidden || false,
      "Latest Partition Modified": partitions.length > 0 ? Math.max(...partitions.map((p: any) => p.modifiedTime || "Unknown")) : "Unknown",
      "Latest Partition Refreshed": partitions.length > 0 ? Math.max(...partitions.map((p: any) => p.refreshedTime || "Unknown")) : "Unknown",
      "Lineage Tag": table.lineageTag || "Unknown"
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
    DataType: column.DataType || "Unknown",
    IsHidden: column.IsHidden || false,
    Format: column.Format || "None"
  }));
  
  const measureData: MeasureData[] = (data.Measures || []).map((measure: any) => ({
    MeasureName: measure.MeasureName || "Unknown",
    TableName: measure.TableName || "Unknown",
    DataType: measure.DataType || "Unknown",
    MeasureExpression: measure.MeasureExpression || ""
  }));
  
  const relationships: Relationship[] = (data.Relationships || []).map((rel: any) => ({
    FromTableName: rel.FromTableName || "Unknown",
    ToTableName: rel.ToTableName || "Unknown",
    cardinality: rel.cardinality || "Unknown",
    FromColumn: rel.FromColumn || "Unknown",
    ToColumn: rel.ToColumn || "Unknown"
  }));
  
  return { daxTableData, columnData, measureData, relationships };
}

function mergeMetadata(tableData: TableData[], daxTableData: Record<string, any>): TableData[] {
  return tableData.map(table => {
    const daxInfo = daxTableData[table["Table Name"]] || {};
    return {
      ...table,
      "Columns Size": daxInfo.ColumnsSize || "N/A",
      "DAX Table Size": daxInfo.TableSize || "N/A"
    };
  });
}
