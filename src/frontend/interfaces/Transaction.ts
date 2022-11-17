export interface Transaction {
  id: string;
  cashFlow: 'OUT' | 'IN';
  to?: string;
  from?: string;
  value: number;
  date: Date;
}
