import { User } from '@modules/users/entities';
export declare enum InvoiceType {
    DEBIT = "DEBIT",
    CREDIT = "CREDIT"
}
export declare enum InvoiceStatus {
    PAID = "PAID",
    PENDING = "PENDING"
}
export declare class PaymentInvoice {
    id: string;
    title: string;
    amount: number;
    type: InvoiceType;
    status: InvoiceStatus;
    date: Date;
    studentId: number;
    student: User;
}
