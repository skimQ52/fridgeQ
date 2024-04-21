export interface Food {
    name: string;
    type: string;
    quantity: number;
    updated_at: string;
}

export interface Meal {
    name: string;
    description: string;
    type: string;
    recipe: string;
    ingredients: string[];
}