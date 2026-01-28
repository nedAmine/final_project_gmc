export interface Settings {
  defaultTax: number;
  useDeliveryRules: boolean;
  deliveryRules: {
    xA: number;
    xB: number;
    A: number;
    B: number;
  };
  defaultPerPage: number;
  defaultListPerPage: number;
}