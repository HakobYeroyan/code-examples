// components
import InProcessStripe from "./components/InProcess/InProcessStripe";
import Cart from "./components/Cart/Cart";
import Successful from "./components/Successful/Successful";
import Failed from "./components/Failed/Failed";

const states = {
  cart: {
    content: Cart
  },
  inProcess: {
    content: InProcessStripe
  },
  successful: {
    content: Successful
  },
  failed: {
    content: Failed
  }
};

export default states;