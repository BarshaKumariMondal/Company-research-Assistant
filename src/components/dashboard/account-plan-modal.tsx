'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type AccountPlanModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  accountPlan: string;
  companyName: string;
};

export default function AccountPlanModal({
  isOpen,
  onOpenChange,
  accountPlan,
  companyName,
}: AccountPlanModalProps) {
    
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Account Plan - ${companyName}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; padding: 2rem; }
              h1, h2, h3 { color: #111; margin-bottom: 0.5em; }
              h1 { font-size: 2em; }
              hr { border: 0; border-top: 1px solid #eee; margin: 2rem 0; }
              pre { white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 1em; }
            </style>
          </head>
          <body>
            <h1>Account Plan: ${companyName}</h1>
            <hr />
            <pre>${accountPlan}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Generated Account Plan for {companyName}</DialogTitle>
          <DialogDescription>
            This is an AI-generated strategic plan. Review and edit as needed.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="flex-1 my-4 pr-6">
            <pre className="whitespace-pre-wrap font-body text-sm text-foreground">
                {accountPlan}
            </pre>
        </ScrollArea>
        <Separator />
        <DialogFooter className="pt-4 sm:justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print / Save as PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
