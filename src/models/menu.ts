export interface FoodTruckMenu {
    categories: Category[];
}

export interface Category {
    name: string;
    items: Item[];
}

export interface Item {
    title: string;
    price: number;
    description: string;
    image: string;
}
