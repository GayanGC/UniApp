export declare class CreateNotificationDto {
    title: string;
    content: string;
    target_type: string;
    target_university?: string;
    target_faculty?: string;
    target_year?: number;
    is_event: boolean;
    event_date?: Date;
}
