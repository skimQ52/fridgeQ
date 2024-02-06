import { handleApiResponse } from "./foodService.ts";

const BASE_URL = 'http://localhost:9000/meals';

export const getMeal = async <T>(name: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/meal?param=${name}`, {
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        })
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
};

export const getMeals = async <T>(userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/meals`, {
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        })
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
};

export const updateFood = async <T>(name: string, quantity: number, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/update_food?name=${name}&quan=${quantity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
        });
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Could not update');
    }
}

export const addMeal = async <T>(data: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/add_meal`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json'
            },
            body: data,
        });
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
}

export const deleteMeal = async <T>(name: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/delete_meal?name=${name}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        });
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
}