'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send, BrainCircuit, Loader2, User } from 'lucide-react';
import { handleCompanyQuery, handleGeneratePlan } from '@/lib/actions';
import type { ConversationMessage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import AccountPlanModal from './account-plan-modal';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const initialState = {
  answer: null,
  error: null,
  planError: null,
  accountPlan: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" className="shrink-0" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

function GeneratePlanButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="outline" size="sm" type="submit" disabled={pending || disabled}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <BrainCircuit className="mr-2 h-4 w-4" />
          Generate Account Plan
        </>
      )}
    </Button>
  );
}

export default function ChatPanel() {
  const [companyName, setCompanyName] = useState('Innovate Corp');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  
  const [queryState, queryAction] = useActionState(handleCompanyQuery, initialState);
  const [planState, planAction] = useActionState(handleGeneratePlan, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const avatarImage = PlaceHolderImages.find(p => p.id === 'avatar');

  useEffect(() => {
    if (queryState.error) {
      toast({ variant: 'destructive', title: 'Error', description: queryState.error });
    }
    if (queryState.answer) {
      const lastUserQuestion = (formRef.current?.elements.namedItem('question') as HTMLInputElement)?.value;
      setConversation(prev => [
        ...prev,
        { role: 'user', content: lastUserQuestion },
        { role: 'assistant', content: queryState.answer as string },
      ]);
      if (questionInputRef.current) {
        questionInputRef.current.value = '';
      }
    }
  }, [queryState, toast]);
  
  useEffect(() => {
    if (planState.planError) {
      toast({ variant: 'destructive', title: 'Error', description: planState.planError });
    }
    if (planState.accountPlan) {
        setGeneratedPlan(planState.accountPlan);
        setIsPlanModalOpen(true);
    }
  }, [planState, toast]);

  const researchSummary = conversation
    .map(msg => `${msg.role === 'user' ? 'User Question' : 'AI Answer'}: ${msg.content}`)
    .join('\n\n');

  return (
    <>
      <Card className="h-full flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle>Company Research Agent</CardTitle>
          <CardDescription>Ask questions about a company to get real-time insights.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="e.g. 'Innovate Corp'"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="font-semibold"
              />
          </div>
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-6">
              {conversation.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  <BrainCircuit className="mx-auto h-12 w-12 mb-2" />
                  <p>Start a conversation by asking a question below.</p>
                </div>
              )}
              {conversation.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                  {message.role === 'assistant' && <div className="bg-primary rounded-full p-2 text-primary-foreground flex-shrink-0"><BrainCircuit size={16} /></div>}
                  <div className={`rounded-lg px-4 py-2 text-sm max-w-[85%] ${message.role === 'user' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
                    {message.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                  {message.role === 'user' && (
                     <Avatar className="w-8 h-8">
                       {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt="User" />}
                       <AvatarFallback><User size={16} /></AvatarFallback>
                     </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <form ref={formRef} action={queryAction} className="w-full flex items-center gap-2">
            <input type="hidden" name="companyName" value={companyName} />
            <Input
              id="question"
              name="question"
              ref={questionInputRef}
              placeholder={companyName ? "e.g., What are their latest financial results?" : "Enter a company name first"}
              className="flex-1"
              disabled={!companyName}
              autoComplete="off"
            />
            <SubmitButton />
          </form>
        </CardFooter>
        <CardFooter className="flex justify-between items-center border-t pt-4 bg-muted/50">
          <p className="text-xs text-muted-foreground">
            Ready to create a plan? Use the conversation to generate one.
          </p>
          <form action={planAction}>
              <input type="hidden" name="companyName" value={companyName} />
              <input type="hidden" name="researchSummary" value={researchSummary} />
              <GeneratePlanButton disabled={conversation.length === 0} />
          </form>
        </CardFooter>
      </Card>
      {generatedPlan && (
         <AccountPlanModal 
            isOpen={isPlanModalOpen}
            onOpenChange={setIsPlanModalOpen}
            accountPlan={generatedPlan}
            companyName={companyName}
         />
      )}
    </>
  );
}
