import { Sales } from '@/models/sales.model';

type UpdateSalesOptions = {
  seller: string;
  product: string;
  quantity: number;
  amount: number;
  soldDate?: string;
  deliveryDays: number;
  isCancelled?: boolean;
};
export const updateSales = async (data: UpdateSalesOptions) => {
  return Sales.create(data);
};
