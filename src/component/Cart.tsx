import { useEffect, useState } from "react";
import {
    couponDiscount,
    onTopDiscount,
    Item_Category,
} from "../utils/discountCategory";
import {
    CartItem,
    CouponDiscount,
    OnTopDiscount,
    SeasonalDiscount,
} from "./Interface/discount";
import { calculateFinalPrice } from "./Discount.ts";

interface CartPageProps {
    details: CartItem[];
}

function Cart({ details }: CartPageProps) {
    const [coupon, setCoupon] = useState<CouponDiscount>({
        type: "--Select--",
        value: 0,
    });
    const [onTop, setOnTop] = useState<OnTopDiscount>({
        type: "--Select--",
        category: "--Select--",
        percentage: 0,
    });
    const [seasonal, setSeasonal] = useState<SeasonalDiscount>({
        every: 1,
        discount: 0,
    });
    const [isSelected, setIsSelected] = useState(false);

    const totalPrice = details.reduce(
        (acc, item) => acc + item.price * item.amount,
        0
    );


    const handleCouponTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCoupon((prev) => ({ ...prev, type: event.target.value, value: 0 }));

    };

    const handleCouponValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = parseFloat(event.target.value) || 0;
        if (newValue < 0) newValue = 0;

        if (coupon.type === "Percentage") {
            newValue = Math.min(newValue, 100); // Limit to 100%
        }
        if (coupon.type === "Fixed") {
            newValue = Math.min(newValue, totalPrice); // Limit to total price
        }
        setCoupon((prev) => ({ ...prev, value: newValue }));
        setSeasonal((prev) => ({
            ...prev, every: 1, discount: 0,
        }));
        setOnTop((prev) => ({ ...prev, percentage: 0 }))
    };

    const handleOnTopTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedType = event.target.value;
        setIsSelected(selectedType === "Item Category");
        setOnTop((prev) => ({ ...prev, type: selectedType, percentage: 0 }));
    };

    const handleOntopCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOnTop((prev) => ({ ...prev, category: event.target.value, percentage: 0 }));
    };

    const handleOnTopValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = parseFloat(event.target.value) || 0;
        let maxPercentage = (remainingAfterCoupon / totalPrice) * 100;
        if (newValue < 0) newValue = 0;

        if (onTop.type === "Item Category") {
            newValue = Math.min(newValue, maxPercentage); // Limit to maxPercentage
        }

        if (onTop.type === "Points") {
            newValue = Math.min(newValue, remainingAfterCoupon * 0.2); // Limit to 20% of total price

        }
        setOnTop((prev) => ({ ...prev, percentage: newValue }));
        setSeasonal((prev) => ({
            ...prev, every: 1, discount: 0,
        }))
    };

    const handleSeasonalEveryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = Math.max(1, parseFloat(event.target.value) || 0); // Minimum 1
        if (newValue <= 0) newValue = 1;
        if (newValue > remainingAfterOntop) newValue = remainingAfterOntop; //Limit to remaining
        setSeasonal((prev) => ({
            ...prev,
            every: newValue,
            discount: 0,
        }));
    };

    const handleSeasonalDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = Math.max(0, parseFloat(event.target.value) || 0); // Minimum 0
        newValue = Math.min(newValue, seasonal.every); // limit max discount
        setSeasonal((prev) => ({ ...prev, discount: newValue }));
    };


    const { total, discounts } = calculateFinalPrice(details, coupon, onTop, seasonal);
    let remainingAfterCoupon = totalPrice - discounts.coupon;
    let remainingAfterOntop = remainingAfterCoupon - discounts.onTop;
    let remainOnTop = totalPrice - discounts.onTop;
    let totalDiscount = discounts.seasonal + discounts.coupon + discounts.onTop;


    useEffect(() => {
        if (totalPrice <= 0) {
            setCoupon({ type: "--Select--", value: 0 });
            setOnTop({ type: "--Select--", category: "--Select--", percentage: 0 });
            setSeasonal({ every: 1, discount: 0 });
        }
    }, [totalPrice]);

    useEffect(() => {
        if (remainingAfterCoupon == 0)
            onTop.percentage = 0;

    }, [coupon, onTop, total, details, discounts, seasonal]);
    if (totalPrice <= 0) {
        return (
            <div className="p-6 bg-red-100 rounded-lg text-center text-red-600 font-semibold">
                Empty Cart!!  Please select more item
            </div>
        );
    }
    return (
        <div className="p-6 bg-gray-200 rounded-lg shadow-md  mx-auto mt-5">
            <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">Discount Settings</h1>

            {/* Coupon Discount */}
            <div className="mb-6">
                <label htmlFor="coupon" className="block font-medium text-gray-700 mb-2">
                    Coupon Discount
                </label>
                <div className="flex items-center space-x-4">
                    {/* Coupon Type Selector */}
                    <select
                        id="coupon"
                        onChange={handleCouponTypeChange}
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 text-center"
                    >
                        {couponDiscount.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    {/* Coupon Value Input */}
                    <div className="relative flex-grow">
                        <input
                            type="number"
                            value={coupon.value}
                            onChange={handleCouponValueChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 "
                            placeholder="Enter discount"
                            min="0"
                            disabled={(coupon.type == "--Select--" || remainOnTop == 0)}
                        />
                        <span className="absolute right-2 top-2 text-gray-500">
                            {coupon.type === "Percentage" ? "%" : "THB"}
                        </span>
                    </div>
                </div>
            </div>

            {/* On Top Discount */}
            <div className="mb-6">
                <label htmlFor="onTop" className="block font-medium text-gray-700 mb-2">
                    On Top Discount
                </label>
                <div className="flex items-center space-x-4">
                    {/* On Top Type Selector */}
                    <select
                        id="onTop"
                        onChange={handleOnTopTypeChange}
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 text-center"
                    >
                        {onTopDiscount.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {/* On Top Value Category Selector */}
                    {isSelected && (
                        <select
                            onChange={handleOntopCategoryChange}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                        >
                            {Item_Category.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    )}
                    {/* On Top Value Input */}
                    <div className="relative ">
                        <input
                            type="number"
                            value={onTop.percentage}
                            onChange={handleOnTopValueChange}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            min="0"
                            disabled={((onTop.type == "--Select--" && onTop.category == "--Select--") || remainingAfterCoupon == 0)}
                        />
                        <span className="absolute top-2 right-2 text-gray-500">
                            {onTop.type === "Points" ? "Points" : "%"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Seasonal Discount */}
            <div className="mb-6">
                <label htmlFor="seasonal-every" className="block font-medium text-gray-700 mb-2">
                    Seasonal Discount
                </label>
                <div className="flex items-center space-x-4">
                    {/* Seasonal Every Input */}
                    <div className="relative">
                        <span>Every </span>
                        <input
                            id="seasonal-every"
                            type="number"
                            value={seasonal.every}
                            onChange={handleSeasonalEveryChange}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            placeholder="Every nth item"
                            min="1"
                            disabled={(remainingAfterCoupon == 0 || remainingAfterOntop == 0)}
                        />
                        <span className="absolute right-2 top-2 text-gray-500">THB</span>
                    </div>
                    <div className="relative">
                        {/* Seasonal Discount Input */}
                        <span>Discount </span>
                        <input
                            id="seasonal-discount"
                            type="number"
                            value={seasonal.discount}
                            onChange={handleSeasonalDiscountChange}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
                            placeholder="Discount amount"
                            min="0"
                            disabled={(remainingAfterCoupon == 0 || remainingAfterOntop == 0)}
                        />
                        <span className="absolute right-2 top-2 text-gray-500">THB</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Discount Details</h2>
                <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                    <li>
                        <span className="font-semibold">Coupon Discount:</span>
                        <span className="ml-2 text-red-500">{discounts.coupon.toFixed(2)} THB</span>
                    </li>
                    <li>
                        <span className="font-semibold">OnTop Discount:</span>
                        <span className="ml-2 text-red-500">{discounts.onTop.toFixed(2)} THB {onTop.type == "Points" && <span> (Maximum Point to use ={remainingAfterCoupon * 0.2}) </span>}</span>
                    </li>
                    <li>
                        <span className="font-semibold">Seasonal Discount:</span>
                        <span className="ml-2 text-red-500">{discounts.seasonal.toFixed(2)} THB</span>
                    </li>
                    <li>
                        <span className="font-semibold">Total Discount:</span>
                        <span className="ml-2 text-red-500">{(totalDiscount).toFixed(2)} THB</span>
                    </li>
                </ul>
                <h3 className="text-xl font-bold mt-6 text-gray-800">
                    Final Total:
                    <span className="text-gray-700 ml-2">{totalPrice}</span> -
                    <span className="text-red-500 mx-1">({totalDiscount.toFixed(2)})</span>
                    =
                    <span className="text-green-600 ml-2">{total.toFixed(2)} THB</span>
                </h3>
            </div>
        </div>
    );
}
export default Cart;
