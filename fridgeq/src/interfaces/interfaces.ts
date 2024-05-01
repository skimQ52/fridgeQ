export interface FoodInterface {
    name: string;
    type: string;
    quantity: number;
    updated_at: string;
}

export interface RecipeInterface {
    name: string;
    description: string;
    type: string;
    recipe: string;
    ingredients: string[];
}