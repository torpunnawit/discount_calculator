// Interfaces for discount parameters
import { CartItem, CouponDiscount, OnTopDiscount, SeasonalDiscount } from "./Interface/discount";

// Calculate fixed or percentage discount for the entire cart
export const calculateCouponDiscount = (
    total: number,
    coupon: CouponDiscount
): number => {
    if (coupon.type.toLowerCase() === "fixed") {
        const discount = Math.min(total, coupon.value);
        return discount;
    } else if (coupon.type.toLowerCase() === "percentage") {
        const discount = (total * coupon.value) / 100;
        return discount;
    }
    else
        return 0;
};

// Calculate on-top discount for specific category
export const calculateOnTopDiscount = (
    cartItems: CartItem[],
    onTop: OnTopDiscount
): number => {
    const categoryTotal = cartItems
        .filter((item) => item.category === onTop.category)
        .reduce((acc, item) => acc + (item.price * item.amount), 0);

    return (categoryTotal * onTop.percentage) / 100;
};

// Calculate discount by points
export const calculatePointsDiscount = (total: number, onTop: OnTopDiscount): number => {
    const maxDiscount = total * 0.2; // 20% cap
    return Math.min(onTop.percentage, maxDiscount);
};

// Calculate seasonal discount
export const calculateSeasonalDiscount = (
    total: number,
    seasonal: SeasonalDiscount
): number => {
    return Math.floor(total / seasonal.every) * seasonal.discount;
};

// Calculate the final price after applying discounts in the correct order
export const calculateFinalPrice = (
    cartItems: CartItem[],
    coupon?: CouponDiscount,
    onTop?: OnTopDiscount,
    seasonal?: SeasonalDiscount
): { total: number; discounts: { coupon: number; onTop: number; seasonal: number } } => {
    let total = cartItems.reduce((acc, item) => acc + (item.price * item.amount), 0);

    const discounts = {
        coupon: 0,
        onTop: 0,
        seasonal: 0,
    };

    if (coupon) {
        discounts.coupon = calculateCouponDiscount(total, coupon);
        total -= discounts.coupon;
    }

    if (onTop) {
        if (onTop.type.toLowerCase() === "points") {
            discounts.onTop = calculatePointsDiscount(total, onTop);
        } else if (onTop.type.toLowerCase() === "item category") {
            discounts.onTop = calculateOnTopDiscount(cartItems, onTop);
        }
        total -= discounts.onTop;
    }

    if (seasonal) {
        discounts.seasonal = calculateSeasonalDiscount(total, seasonal);
        total -= discounts.seasonal;
    }

    total = Math.max(total, 0);

    return { total, discounts };
};
