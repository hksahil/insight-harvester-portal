
import { ProcessedData } from './VpaxProcessor';
import { supabase } from '@/integrations/supabase/client';

export async function processPbixFile(file: File): Promise<ProcessedData> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data, error } = await supabase.functions.invoke('process-pbix', {
      body: formData,
    });

    if (error) {
      throw new Error(`Failed to process PBIX file: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to process PBIX file');
    }

    return data.data as ProcessedData;
  } catch (error) {
    console.error('Error processing PBIX file:', error);
    throw error;
  }
}
