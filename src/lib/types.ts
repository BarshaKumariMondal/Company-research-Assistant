export type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type FinancialData = {
    month: string;
    revenue: number;
    profit: number;
};

export type MarketShareData = {
    name: string;
    value: number;
};

export type EmployeeData = {
    year: string;
    count: number;
};
