import { commerce } from 'faker';
import { Order, Product, ProductShortInfo } from '../common/types';

const generateProducts = () => {
    const products: Product[] = []

    for(let id = 0; id < 27; id++) {
        products.push({
            id,
            name: `${commerce.productAdjective()} ${commerce.product()}`,
            description: commerce.productDescription(),
            price: Number(commerce.price()),
            color: commerce.color(),
            material: commerce.productMaterial(),
        });
    }

    return products;
}

function getShortInfo({ id, name, price }: Product): ProductShortInfo {
    return { id, name, price };
}

export const SIZE = 200;

export class ExampleStore {
    private readonly products: Product[] = generateProducts();
    private readonly orders: (Order | { id: number })[] = [];

    getAllProducts(): ProductShortInfo[] {
        return this.products.map(getShortInfo);
    }

    getProductById(id: number): Product | undefined {
        const [product] = this.products.filter(p => p.id === id);
        return product;
    }

    createOrder(order: Order): number {
        const id = this.orders.length + 1;
        this.orders.push({ id, ...order });
        return id;
    }

    getLatestOrders() {
        return this.orders.slice(-SIZE);
    }
}
