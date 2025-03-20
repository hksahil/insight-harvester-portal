
import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProcessedData } from '@/services/VpaxProcessor';
import { toast } from 'sonner';
import UseCaseHelper from './UseCaseHelper';

interface DocumentationTabProps {
  data: ProcessedData;
}

const DocumentationTab: React.FC<DocumentationTabProps> = ({ data }) => {
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');

  const handleExport = () => {
    if (exportFormat === 'excel') {
      toast.info('Excel export is not implemented in this demo. The feature would export all data tabs to an Excel workbook.');
    } else {
      toast.info('PDF export is not implemented in this demo. The feature would export all data to a formatted PDF document.');
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
          
          <Button onClick={handleExport} className="mt-4 gap-2">
            <Download className="h-4 w-4" />
            Export Documentation
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
