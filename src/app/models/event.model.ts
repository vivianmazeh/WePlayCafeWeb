export class Event {

    public id!: number; 
    public package_price!: number;
    public date!: Date;  
    public time!: number; 
    public dateString!: string;
    public timeString!: string;   
    public customer_name!: string;
    public customer_email!: string;
    public customer_phone!: string;
    public deposit!: number;
    public remain_payment!: number;
    public if_paid_remain_payment!: boolean;

    constructor(){

    }
    
}
