import { QueryClient } from "react-query";
import { category } from "./Category";
import { Product } from "./Producto";
import { proDetaegory } from "./ProductDetail";

const queryClient = new QueryClient()

category(queryClient);
Product(queryClient);
proDetaegory(queryClient);

export default queryClient;