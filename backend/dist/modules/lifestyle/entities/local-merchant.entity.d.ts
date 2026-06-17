import { Campus } from '@modules/campus-guide/entities/campus.entity';
export declare class LocalMerchant {
    id: string;
    name: string;
    category: string;
    discountDescription: string;
    couponCode: string;
    campusId: number;
    campus: Campus;
}
