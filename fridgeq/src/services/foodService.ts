

const BASE_URL = 'http://localhost:8000/api/food';

export interface ApiResponse<T> {
    data: T;
}

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
    if (response.ok) {
        const data: ApiResponse<T> = await response.json();
        console.log(data.data)
        return data.data;
    } else {
        throw new Error((await response.json()).message || 'Something went wrong');
    }
};

export const getFood = async <T>(name: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}?param=${name}`, {
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        })
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
};

export const getFoods = async <T>(userToken: string): Promise<T> => {
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

export const updateFood = async <T>(name: string, quantity: number, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}?name=${name}&quan=${quantity}`, {
            method: 'PATCH',
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

export const addFood = async <T>(data: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            },
            body: data,
        });
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
}

export const deleteFood = async <T>(name: string, userToken: string): Promise<T> => {
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