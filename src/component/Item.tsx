import { useState } from "react";
import { CartItem } from "./Interface/discount";
import Cart from "./Cart";

function ItemCard() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, name: "T-Shirt", category: "Clothing", price: 350, amount: 0 },
        { id: 2, name: "Hoodie", category: "Clothing", price: 700, amount: 0 },
        { id: 3, name: "Watch", category: "Electronics", price: 850, amount: 0 },
        { id: 4, name: "Bag", category: "Accessories", price: 640, amount: 0 },
        { id: 5, name: "Belt", category: "Accessories", price: 230, amount: 0 },
        { id: 6, name: "Hat", category: "Accessories", price: 250, amount: 0 },
    ]);

    const updateAmount = (id: number, change: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, amount: Math.max(0, item.amount + change) }
                    : item
            )
        );
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + item.amount, 0);
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.amount,
        0
    );

    return (
        <div className="container mx-auto p-6 bg-gray-50">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                Shopping Cart
            </h1>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg shadow-sm bg-white"
                    >
                        <h2 className="text-lg font-semibold text-gray-700">{item.name}</h2>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-xl text-gray-800 mt-2">
                            {item.price > 0 ? `${item.price} THB` : "Free"}
                        </p>
                        <div className="flex items-center mt-4 space-x-4">
                            <button
                                onClick={() => updateAmount(item.id, -1)}
                                disabled={item.amount === 0}
                                className="px-4 py-2 bg-red-500 text-white rounded shadow-sm hover:bg-red-600 disabled:bg-red-300"
                            >
                                -
                            </button>
                            <span className="text-lg font-medium">{item.amount}</span>
                            <button
                                onClick={() => updateAmount(item.id, 1)}
                                className="px-4 py-2 bg-blue-500 text-white rounded shadow-sm hover:bg-blue-600"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg shadow-sm text-center">
                <h2 className="text-2xl font-semibold text-gray-700">Summary</h2>
                <p className="text-lg text-gray-600 mt-2">
                    Total Amount: <span className="font-bold">{totalAmount}</span>
                </p>
                <p className="text-lg text-gray-600 mt-1">
                    Total Price: <span className="font-bold">{totalPrice} THB</span>
                </p>
            </div>

            {/* <div className="mt-6 flex justify-center">
                <button className="px-6 py-3 bg-green-500 text-white rounded shadow-sm text-lg font-medium hover:bg-green-600">
                    Proceed to Checkout
                </button>
            </div> */}

            <Cart details={cartItems} />
        </div>
    );
}

export default ItemCard;
