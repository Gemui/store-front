import OrderStatus from "../enums/orderStatus.enum";
import OrderProduct from "./orderProducts.type";
// import OrderStatus from "./orderStatus.type";

type Order = {
  id? : number;
  user_id : number;
  status : OrderStatus;
  orderProducts? : Array<OrderProduct>
}

export default Order;
