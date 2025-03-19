
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
    
    // Extract and parse model.bim file
    const modelBimFile = zipData.file('model.bim');
    if (!modelBimFile) {
      throw new Error('model.bim file not found in the VPAX package');
    }
    const modelBimContent = await modelBimFile.async('string');
    const modelBimData = JSON.parse(modelBimContent);
    
    // Extract and parse DaxVpaView.json file
    const daxVpaViewFile = zipData.file('DaxVpaView.json');
    if (!daxVpaViewFile) {
      throw new Error('DaxVpaView.json file not found in the VPAX package');
    }
    const daxVpaViewContent = await daxVpaViewFile.async('string');
    const daxVpaViewData = JSON.parse(daxVpaViewContent);
    
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
  const tables = data.model?.tables || [];
  const { numPartitions, maxRowCount, totalTableSize, tableData, expressionData } = calculateMetadata(tables);
  
  const modelInfo: ModelInfo = {
    Attribute: ["Model Name", "Date Modified", "Total Size of Model", "Storage Format", "Number of Tables", "Number of Partitions", "Max Row Count of Biggest Table", "Total Columns", "Total Measures"],
    Value: [
      data.name || "Unknown",
      data.lastUpdate || "Unknown",
      data.model?.estimatedSize || "Not Available",
      data.model?.defaultPowerBIDataSourceVersion || "Unknown",
      tables.length,
      numPartitions,
      maxRowCount,
      tables.reduce((sum: number, table: any) => sum + (table.columns?.length || 0), 0),
      tables.reduce((sum: number, table: any) => sum + (table.measures?.length || 0), 0)
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
