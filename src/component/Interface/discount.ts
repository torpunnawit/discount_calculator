// Interfaces for discount parameters
export interface CartItem {
    id: number;
    name: string;
    category: string;
    price: number;
    amount: number;
}

export interface CouponDiscount {
    type: string;
    value: number; // Fixed amount or percentage
}

export interface OnTopDiscount {
    type: string;
    category: string;
    percentage: number; // Percentage discount for a specific category
}

export interface PointsDiscount {
    points: number; // Points used by customer
}

export interface SeasonalDiscount {
    every: number; // Every X THB
    discount: number; // Subtracted Y THB
}