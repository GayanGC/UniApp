import { Repository } from 'typeorm';
import { PaymentInvoice } from './payment-invoice.entity';
export declare class FinanceService {
    private readonly invoiceRepository;
    constructor(invoiceRepository: Repository<PaymentInvoice>);
    getSummary(studentId: number): Promise<{
        totalDue: number;
        totalPaid: number;
        activeScholarships: number;
    }>;
    getInvoices(studentId: number): Promise<PaymentInvoice[]>;
    getChartData(studentId: number): Promise<{
        month: string;
        paid: number;
        received: number;
    }[]>;
}
