
export type Category = 'Cake' | 'Confectionery';

// Changed from union type to string to support dynamic sections
export type Section = string;

export type PaymentTier = 'standard' | 'premium' | 'luxury';

export interface PriceMap {
  '0.5kg'?: number;
  '1kg'?: number;
  'piece'?: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  sections: Section[];
  description: string;
  prices: PriceMap;
  images: string[];
  paymentTier: PaymentTier; // New field for QR logic
}

export interface OrderItem {
  productId: string;
  name: string;
  weight: string;
  quantity: number;
  totalPrice: number;
}

export interface CustomerDetails {
  fullName: string;
  mobile: string;
  address: string;
  paymentMethod: 'COD' | 'UPI';
}

export interface GlobalState {
  wishlist: string[];
  lastOrder?: {
    item: OrderItem;
    customer: CustomerDetails;
  };
}
