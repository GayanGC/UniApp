import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentInvoice, InvoiceType, InvoiceStatus } from './payment-invoice.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(PaymentInvoice)
    private readonly invoiceRepository: Repository<PaymentInvoice>,
  ) {}

  async getSummary(studentId: number) {
    const invoices = await this.invoiceRepository.find({ where: { studentId } });

    let totalDue = 0;
    let totalPaid = 0;
    let activeScholarships = 0;

    for (const inv of invoices) {
      const amount = Number(inv.amount);
      if (inv.type === InvoiceType.DEBIT) {
        if (inv.status === InvoiceStatus.PENDING) totalDue += amount;
        if (inv.status === InvoiceStatus.PAID) totalPaid += amount;
      } else if (inv.type === InvoiceType.CREDIT) {
        // Assume CREDITs are scholarships/stipends
        activeScholarships += 1;
      }
    }

    return { totalDue, totalPaid, activeScholarships };
  }

  async getInvoices(studentId: number): Promise<PaymentInvoice[]> {
    return await this.invoiceRepository.find({
      where: { studentId },
      order: { date: 'DESC' },
    });
  }

  async getChartData(studentId: number) {
    const invoices = await this.invoiceRepository.find({
      where: { studentId },
      order: { date: 'ASC' },
    });

    // Group by Month-Year (e.g., 'Jan 2026')
    const groupedData: Record<string, { month: string; paid: number; received: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (const inv of invoices) {
      const date = new Date(inv.date);
      const key = `${months[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!groupedData[key]) {
        groupedData[key] = { month: key, paid: 0, received: 0 };
      }

      const amount = Number(inv.amount);
      if (inv.type === InvoiceType.DEBIT && inv.status === InvoiceStatus.PAID) {
        groupedData[key].paid += amount;
      } else if (inv.type === InvoiceType.CREDIT && inv.status === InvoiceStatus.PAID) {
        groupedData[key].received += amount;
      }
    }

    return Object.values(groupedData);
  }
}
