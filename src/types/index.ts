
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  vendorId: string;
  vendorName: string;
  rating: number;
  stock: number;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}
