
import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProcessedData } from '@/services/VpaxProcessor';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import UseCaseHelper from './UseCaseHelper';

// Add the necessary type augmentation for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface DocumentationTabProps {
  data: ProcessedData;
}

const DocumentationTab: React.FC<DocumentationTabProps> = ({ data }) => {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      if (exportFormat === 'excel') {
        exportToExcel();
      } else {
        exportToPdf();
      }
      
      toast.success(`${exportFormat.toUpperCase()} export completed successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Error during export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
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

  const exportToPdf = () => {
    // Get the model name for the file name
    const modelName = data.modelInfo.Value[0]?.toString().replace(/[^a-zA-Z0-9]/g, '_') || 'PowerBI_Model';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const fileName = `${modelName}_Documentation_${timestamp}.pdf`;
    
    try {
      // Create a new PDF document (A4 size)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      doc.setFontSize(20);
      doc.text('Power BI Model Documentation', 20, 20);
      
      // Add model name and timestamp
      doc.setFontSize(12);
      doc.text(`Model: ${data.modelInfo.Value[0]?.toString() || 'Unknown'}`, 20, 30);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 37);
      
      // Add model info table
      doc.setFontSize(16);
      doc.text('Model Information', 20, 50);
      
      const modelInfoRows = data.modelInfo.Attribute.map((attr, index) => [
        attr, 
        data.modelInfo.Value[index]?.toString() || 'N/A'
      ]);
      
      // Explicitly check if autoTable exists
      if (typeof doc.autoTable !== 'function') {
        throw new Error('autoTable is not available. Make sure jspdf-autotable is properly loaded.');
      }
      
      // Use autoTable with correct typing
      doc.autoTable({
        startY: 55,
        head: [['Attribute', 'Value']],
        body: modelInfoRows,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        margin: { top: 20, right: 20, bottom: 20, left: 20 }
      });
      
      // Get the final Y position after the table
      let finalY = (doc as any).lastAutoTable?.finalY || 60;
      
      // Add tables summary
      if (data.tableData.length > 0) {
        finalY += 15;
        doc.setFontSize(16);
        doc.text('Tables Summary', 20, finalY);
        
        // Get table headers
        const tableHeaders = Object.keys(data.tableData[0]).slice(0, 5); // Limit columns for readability
        
        // Get table rows (limit to first 10 rows for PDF readability)
        const tableRows = data.tableData.slice(0, 10).map(row => 
          tableHeaders.map(header => row[header]?.toString() || 'N/A')
        );
        
        // Use autoTable with correct typing
        doc.autoTable({
          startY: finalY + 5,
          head: [tableHeaders],
          body: tableRows,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          margin: { top: 20, right: 20, bottom: 20, left: 20 }
        });
        
        finalY = (doc as any).lastAutoTable?.finalY || finalY;
      }
      
      // Add new page for relationships
      doc.addPage();
      
      // Add relationship summary
      if (data.relationships.length > 0) {
        doc.setFontSize(16);
        doc.text('Relationships Summary', 20, 20);
        
        // Simplified relationship representation for PDF
        const relationshipRows = data.relationships.slice(0, 10).map(rel => [
          rel.FromTableName,
          rel.FromColumn || 'N/A',
          '→',
          rel.ToTableName,
          rel.ToColumn || 'N/A',
          rel.cardinality || 'N/A'
        ]);
        
        // Use autoTable with correct typing
        doc.autoTable({
          startY: 25,
          head: [['From Table', 'From Column', '', 'To Table', 'To Column', 'Cardinality']],
          body: relationshipRows,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          margin: { top: 20, right: 20, bottom: 20, left: 20 }
        });
        
        finalY = (doc as any).lastAutoTable?.finalY || 60;
      }
      
      // Add footnote
      const footerY = 280; // Near bottom of A4 page
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by Power BI Assistant', 20, footerY);
      
      // Save the PDF
      doc.save(fileName);
    } catch (error) {
      console.error("PDF generation error:", error);
      throw error;
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-2">
      <h2 className="text-xl font-medium">Documentation</h2>
      
      <UseCaseHelper type="model-metadata" />
      
      <div className="bg-muted/30 rounded-lg p-6 border border-border space-y-6">
        <div className="max-w-xl">
          <h3 className="text-lg font-medium mb-2">Export Model Documentation</h3>
          <p className="text-muted-foreground mb-4">
            Export your Power BI model metadata to create comprehensive documentation 
            for your team or stakeholders. Choose from the available formats below.
          </p>
          
          <Tabs defaultValue="excel" onValueChange={(value) => setExportFormat(value as 'excel' | 'pdf')}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="excel">Excel</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
            
            <TabsContent value="excel" className="space-y-4">
              <div className="flex items-center p-4 bg-background rounded-lg border border-border gap-4">
                <FileSpreadsheet className="h-10 w-10 text-green-600" />
                <div>
                  <h4 className="font-medium">Excel Export</h4>
                  <p className="text-sm text-muted-foreground">Exports all metadata as separate worksheets in an Excel file</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pdf" className="space-y-4">
              <div className="flex items-center p-4 bg-background rounded-lg border border-border gap-4">
                <FileText className="h-10 w-10 text-red-600" />
                <div>
                  <h4 className="font-medium">PDF Export</h4>
                  <p className="text-sm text-muted-foreground">Creates a formatted PDF document with all model metadata</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
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
    </div>
  );
};

export default DocumentationTab;
