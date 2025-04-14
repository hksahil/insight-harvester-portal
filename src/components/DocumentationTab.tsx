
import React, { useState, useRef } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import UseCaseHelper from './UseCaseHelper';
import { ProcessedData } from '@/services/VpaxProcessor';
import RelationshipFlowVisualizer from './RelationshipFlowVisualizer';
import html2canvas from 'html2canvas';

interface DocumentationTabProps {
  data: ProcessedData;
}

const DocumentationTab: React.FC<DocumentationTabProps> = ({ data }) => {
  const [isExporting, setIsExporting] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // First, capture the relationship diagram as an image
      if (flowRef.current) {
        const canvas = await html2canvas(flowRef.current, {
          backgroundColor: '#ffffff',
          logging: false,
          scale: 2, // Higher quality
        });
        
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/png');
        
        // Now export to Excel with the image
        exportToExcel(imageData);
      } else {
        // Export without image if ref is not available
        exportToExcel();
      }
      
      toast.success('Excel export completed successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Error during export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = (diagramImage?: string) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Add model info sheet
    const modelInfoData = [
      ["Attribute", "Value"],
      ...data.modelInfo.Attribute.map((attr, index) => [
        attr, 
        data.modelInfo.Value[index]
      ])
    ];
    const modelInfoSheet = XLSX.utils.aoa_to_sheet(modelInfoData);
    XLSX.utils.book_append_sheet(workbook, modelInfoSheet, "Model Info");
    
    // Add relationship diagram sheet if image is available
    if (diagramImage) {
      // Create a worksheet for the diagram
      const ws = XLSX.utils.aoa_to_sheet([
        ["Model Relationship Diagram"],
        ["This diagram shows the relationships between tables in your model"]
      ]);
      
      // Set column widths
      ws['!cols'] = [{ wch: 120 }]; // Make column wider
      
      // Set row heights
      ws['!rows'] = [{ hpt: 30 }, { hpt: 30 }, { hpt: 400 }]; // Make row taller for image
      
      // For XLSX version that doesn't have direct image support,
      // we'll add a note explaining the diagram is available separately
      ws.A3 = { 
        t: 's', 
        v: "The model relationship diagram can't be embedded directly. You can find it saved separately."
      };
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, ws, "Relationship Diagram");
      
      // Save the image separately
      try {
        // Remove the header from the data URL
        const base64Data = diagramImage.split(',')[1];
        
        // Create a binary string from the base64 data
        const binaryString = atob(base64Data);
        
        // Convert binary string to array buffer
        const byteArray = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteArray[i] = binaryString.charCodeAt(i);
        }
        
        // Generate the file name
        const modelName = data.modelInfo.Value[0]?.toString().replace(/[^a-zA-Z0-9]/g, '_') || 'PowerBI_Model';
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
        const diagramFileName = `${modelName}_Relationship_Diagram_${timestamp}.png`;
        
        // Create a blob from the array buffer
        const blob = new Blob([byteArray], { type: 'image/png' });
        
        // Create a download link and click it
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = diagramFileName;
        downloadLink.click();
      } catch (error) {
        console.error('Error saving diagram image:', error);
      }
    }
    
    // Add tables sheet
    if (data.tableData.length > 0) {
      const tableSheet = XLSX.utils.json_to_sheet(data.tableData);
      XLSX.utils.book_append_sheet(workbook, tableSheet, "Tables");
    }
    
    // Add columns sheet
    if (data.columnData.length > 0) {
      const columnSheet = XLSX.utils.json_to_sheet(data.columnData);
      XLSX.utils.book_append_sheet(workbook, columnSheet, "Columns");
    }
    
    // Add measures sheet
    if (data.measureData.length > 0) {
      const measureSheet = XLSX.utils.json_to_sheet(data.measureData);
      XLSX.utils.book_append_sheet(workbook, measureSheet, "Measures");
    }
    
    // Add relationships sheet
    if (data.relationships.length > 0) {
      const relationshipSheet = XLSX.utils.json_to_sheet(data.relationships);
      XLSX.utils.book_append_sheet(workbook, relationshipSheet, "Relationships");
    }
    
    // Add expressions sheet
    if (data.expressionData.length > 0) {
      const expressionSheet = XLSX.utils.json_to_sheet(data.expressionData);
      XLSX.utils.book_append_sheet(workbook, expressionSheet, "Expressions");
    }
    
    // Generate the file name
    const modelName = data.modelInfo.Value[0]?.toString().replace(/[^a-zA-Z0-9]/g, '_') || 'PowerBI_Model';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const fileName = `${modelName}_Documentation_${timestamp}.xlsx`;
    
    // Write and download the file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="animate-fade-in space-y-6 p-2">
      <h2 className="text-xl font-medium">Documentation</h2>
      
      {/* <UseCaseHelper type="model-metadata" /> */}
      
      <div className="bg-muted/30 rounded-lg p-6 border border-border space-y-6">
        <div className="max-w-xl">
          <h3 className="text-lg font-medium mb-2">Export Model Documentation</h3>
          <p className="text-muted-foreground mb-4">
            Export your Power BI model metadata to create comprehensive documentation 
            for your team or stakeholders.
          </p>
          
          <div className="flex items-center p-4 bg-background rounded-lg border border-border gap-4 mb-4">
            <FileSpreadsheet className="h-10 w-10 text-green-600" />
            <div>
              <h4 className="font-medium">Excel Export</h4>
              <p className="text-sm text-muted-foreground">Exports all metadata as separate worksheets in an Excel file</p>
            </div>
          </div>
          
          <Button 
            onClick={handleExport} 
            className="mt-4 gap-2"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Documentation
              </>
            )}
          </Button>
        </div>
        
        <div className="pt-4 border-t border-border">
          <h4 className="font-medium mb-2">What will be included:</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Model metadata and summary</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Relationship diagram visualization (as a separate PNG file)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Table list with properties ({data.tableData.length} tables)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Column definitions ({data.columnData.length} columns)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Measure definitions ({data.measureData.length} measures)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Relationship mapping ({data.relationships.length} relationships)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>M expressions for each table</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Hidden relationship diagram for capturing */}
      <div className="hidden">
        <div ref={flowRef} style={{ width: '1200px', height: '800px', background: 'white' }}>
          <RelationshipFlowVisualizer relationships={data.relationships} />
        </div>
      </div>
    </div>
  );
};

export default DocumentationTab;
