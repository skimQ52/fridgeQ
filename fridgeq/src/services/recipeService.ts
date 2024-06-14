import {handleApiResponse} from "./foodService.ts";

const BASE_URL = 'http://localhost:8000/api/recipe';

export const getRecipe = async <T>(name: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}?name=${name}`, {
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        })
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
};

export const getRecipes = async <T>(userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        })
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
};

export const addRecipe = async <T>(data: string, userToken: string): Promise<T> => {
    try {
        console.log(data);
        const response = await fetch(`${BASE_URL}`, {
            method: 'PUT',
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

export const deleteRecipe = async <T>(name: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}?name=${name}`, {
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

export const generateRecipe = async <T>(data: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`http://localhost:8000/api/chat`, {
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