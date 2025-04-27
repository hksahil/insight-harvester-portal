
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface Snippet {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  category: string;
  submittedBy?: string;
  submittedDate: string;
}

interface SnippetsTableProps {
  snippets: Snippet[];
}

const SnippetsTable: React.FC<SnippetsTableProps> = ({ snippets }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {snippets.map((snippet) => (
            <TableRow key={snippet.id}>
              <TableCell className="font-medium">{snippet.title}</TableCell>
              <TableCell className="max-w-md">{snippet.description}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {snippet.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {snippet.language}
                </Badge>
              </TableCell>
              <TableCell>{snippet.submittedBy}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(snippet.submittedDate), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SnippetsTable;
