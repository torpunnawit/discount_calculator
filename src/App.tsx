
// } from "./component/Interface/discount";
// import { calculateFinalPrice } from "./component/Discount.ts"
import Item from "./component/Item.tsx";
import ItemCard from "./component/ItemCard.tsx";


function App() {


  return (
    <div>
      {/* <h1>Shopping Cart</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} ({item.category}) - {item.price} THB
          </li>
        ))}
      </ul>
      <h2>Total: {total.toFixed(2)} THB</h2> */}
      <Item />

    </div>
  );
};

export default App;
