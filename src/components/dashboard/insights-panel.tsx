import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FinancialChart from './financial-chart';
import MarketShareChart from './market-share-chart';
import EmployeeChart from './employee-chart';
import { Separator } from '../ui/separator';
import { getCompanyFinancials } from '@/ai/flows/get-company-financials';
import { getCompanyMetrics } from '@/ai/flows/get-company-metrics';
import { mockFinancialData, mockMarketShareData, mockEmployeeData } from '@/lib/mock-data';

export default async function InsightsPanel() {
    const companyName = 'Innovate Corp';
    
    let financials;
    let metrics;

    try {
        financials = await getCompanyFinancials({ companyName });
    } catch(e) {
        console.error("Failed to fetch financials, using mock data", e);
        financials = { financials: mockFinancialData };
    }

    try {
        metrics = await getCompanyMetrics({ companyName });
    } catch (e) {
        console.error("Failed to fetch metrics, using mock data", e);
        metrics = { marketShare: mockMarketShareData, employeeGrowth: mockEmployeeData };
    }
  
    const { financials: financialData } = financials;
    const { marketShare, employeeGrowth } = metrics;


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>Key metrics for {companyName}.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
            <FinancialChart data={financialData} />
            <Separator />
            <div className="grid md:grid-cols-2 gap-8">
                <MarketShareChart data={marketShare} />
                <EmployeeChart data={employeeGrowth} />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
