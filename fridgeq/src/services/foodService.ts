

const BASE_URL = 'http://localhost:9000/mongoAPI';

export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
}

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
    if (response.ok) {
        const data: ApiResponse<T> = await response.json();
        console.log(data);
        return data.data;
    } else {
        throw new Error((await response.json()).message || 'Something went wrong');
    }
};

export const getFood = async <T>(name: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/food?param=${name}`, {
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        })
        console.log(response);
        return handleApiResponse(response);
    } catch (error) {
        throw new Error('Network error');
    }
};

export const getFoods = async <T>(userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/foods`, {
            headers: {
                'Authorization': `Bearer ${userToken}` // Pass token in for authorization
            }
        })
        console.log(response);
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

export const addFood = async <T>(data: string, userToken: string): Promise<T> => {
    try {
        const response = await fetch(`${BASE_URL}/add_food`, {
            method: 'POST',
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
        const response = await fetch(`${BASE_URL}/delete_food?name=${name}`, {
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