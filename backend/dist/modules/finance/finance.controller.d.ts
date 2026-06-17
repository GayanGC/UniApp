import { FinanceService } from './finance.service';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    getSummary(userId: number): Promise<{
        totalDue: number;
        totalPaid: number;
        activeScholarships: number;
    }>;
    getInvoices(userId: number): Promise<import("./payment-invoice.entity").PaymentInvoice[]>;
    getChartData(userId: number): Promise<{
        month: string;
        paid: number;
        received: number;
    }[]>;
}
