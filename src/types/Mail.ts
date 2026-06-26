export interface MailItem {
    id: number;
    from : string;
    subject: string,
    sent: string;
    attachment: boolean;
    size: string;
}