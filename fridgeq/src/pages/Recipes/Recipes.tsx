import React, {useEffect, useState} from "react";
import {usePage} from '../../context/PageContext';
import {useAuthContext} from '../../hooks/useAuthContext';
import Recipe from "./Recipe.tsx";
import {addRecipe, deleteRecipe, generateRecipe, getRecipe, getRecipes} from "../../services/recipeService.ts";
import RecipePopup from "./RecipePopup.tsx";
import {FilterBar} from "../../components/FilterBar.tsx";
import {SelectFoodsPopup} from "./SelectFoodsPopup.tsx";
import {AddRecipePopup} from "./AddRecipePopup.tsx";
import {GeneratedRecipePopup} from "./GeneratedRecipePopup.tsx";
import LoadingOverlay from 'react-loading-overlay-ts';
import {FoodInterface, RecipeInterface} from "../../interfaces/interfaces.ts";

const Recipes = () => {

    const {user} = useAuthContext();
    const { setCurrentPage } = usePage();

    const [recipes, setRecipes] = useState<RecipeInterface[]>([]);
    const [allRecipes, setAllRecipes] = useState<RecipeInterface[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<RecipeInterface[]>([]);
    const [selectedFoods, setSelectedFoods] = useState<FoodInterface[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const [isSelectFoodsPopup, setIsSelectFoodsPopup] = useState(false);
    const [isAddRecipePopup, setIsAddRecipePopup] = useState(false);

    const [isGeneratedPopup, setIsGeneratedPopup] = useState(false);

    const [isRecipePopup, setIsRecipePopup] = useState(false);
    const [recipePopup, setRecipePopup] = useState<RecipeInterface>({
        name: '',
        description: '',
        type: '',
        recipe: '',
        ingredients: [],
    });

    const fetchRecipes = async () => {
        if (!user) {
            return;
        }
        try {
            const data = await getRecipes(user.token) as RecipeInterface[];
            if (data) {
                setRecipes(data);
                setFilteredRecipes(data);
                setAllRecipes(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const fetchRecipe = async (name: string) => {
        if (!user) {
            return;
        }
        try {
            const data = await getRecipe(name, user.token) as RecipeInterface;
            if (data) {
                setRecipePopup(data);
                setIsRecipePopup(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleNewRecipe = async (recipe: RecipeInterface, e: any) => {
        e.preventDefault();
        if (!user) {
            return;
        }
        const dataString = JSON.stringify(recipe);
        try {
            const response = await addRecipe(dataString, user.token);
            console.log(response);
            await fetchRecipes();
            setIsAddRecipePopup(false);
        } catch (error) {
            e.preventDefault();
            console.error('Error:', error);
        }
    };

    const handleDelete = async (name: string) => {
        if (!user) {
            return;
        }
        try {
            const response = await deleteRecipe(name, user.token);
            console.log(response);
            setIsRecipePopup(false);
            await fetchRecipes()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleQueryChange = (query: string, filter: string) => {
        const filtered = allRecipes.filter(item =>
            filter ? item.type.toLowerCase().includes(filter.toLowerCase()) : item.name.toLowerCase().includes(filter.toLowerCase())
        );
        const filtered2 = query ? filtered.filter(item => item.name.toLowerCase().includes(query.toLowerCase())) : filtered;
        setRecipes(filtered2);
        setFilteredRecipes(filtered2);
    };

    const sortAlphabetically = (sort: boolean) => {
        if (!sort) {
            const sortedRecipes = [...filteredRecipes].sort((a, b) => a.name.localeCompare(b.name));
            setRecipes(sortedRecipes);
            return;
        }
        setRecipes(filteredRecipes);
    }

    const handleGenerateRecipe = async (ingredients: string[], type: string, e: any) => {
        if (!user) {
            return;
        }
        const data = {
            ingredients: ingredients,
            type: type
        };
        const dataString = JSON.stringify(data);
        setIsLoading(true);
        try {
            const response = await generateRecipe(dataString, user.token) as RecipeInterface;
            console.log(response);
            setIsLoading(false);
            setRecipePopup({
                name: response.name,
                description: response.description,
                type: type,
                recipe: response.recipe,
                ingredients: ingredients,
            })
            setIsGeneratedPopup(true);
        } catch (error) {
            e.preventDefault();
            console.error('Error:', error);
        }
    };

    const discardGeneratedRecipe = async () => {
        setIsGeneratedPopup(false);
        await fetchRecipes();
    }

    function closeSelectPopupAndOpenAddPopup(checkedFoods: FoodInterface[]) {
        setIsSelectFoodsPopup(false);
        setIsAddRecipePopup(true);
        setSelectedFoods(checkedFoods);
    }

    useEffect(() => {
        if (user) {
            setCurrentPage('Recipes');
            (async () => {//IIFE
                try {
                    await fetchRecipes()
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    },[])

    return (
        <LoadingOverlay active={isLoading} spinner text='Generating Recipe...' styles={{wrapper: {height: '100%'}}}>
        <div className='page'>
            <div className={(isAddRecipePopup) ? 'fridge-outer blur' : 'fridge-outer'}>
                <FilterBar onChange={handleQueryChange} sort={sortAlphabetically}>
                    <option value="" defaultValue="true">Type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="other">Other</option>
                </FilterBar>
                {recipes.length === 0 ? ( //TODO: IMPROVE
                    <p>No recipes available</p>
                ) : (
                    <ul className="Meals blur-top-and-bottom">
                        {recipes.map((item, index) => (
                            <Recipe key={index} name={item.name} type={item.type} desc={item.description}
                                    onItemClicked={fetchRecipe}></Recipe>
                        ))}
                    </ul>
                )}
                <button onClick={() => setIsSelectFoodsPopup(true)} className='glow-on-hover add-btn'>+</button>
            </div>

            {isRecipePopup &&
                <RecipePopup onClick={() => setIsRecipePopup(false)} recipe={recipePopup} onDelete={handleDelete}/>
            }

            {isSelectFoodsPopup &&
                <SelectFoodsPopup onClick={() => setIsSelectFoodsPopup(false)} onSubmit={closeSelectPopupAndOpenAddPopup} onGenerate={handleGenerateRecipe}/>
            }

            {isAddRecipePopup &&
                <AddRecipePopup onClick={() => setIsAddRecipePopup(false)} onSubmit={handleNewRecipe} foods={selectedFoods}/>
            }

            {/* Generated Recipe Popup */}
            {isGeneratedPopup &&
                <GeneratedRecipePopup onClick={discardGeneratedRecipe} onSubmit={handleNewRecipe} generated={recipePopup}/>
            }
        </div>
        </LoadingOverlay>
    );
}


export default Recipes;