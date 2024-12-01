import React, { useState } from 'react';
import { searchRecipes, getRecipeIngredients } from '../api/api';
import './styles.css';

const RecipesPage = () => {
    const [recipes, setRecipes] = useState<{ id: number; title: string; image: string }[]>([]);
    const [ingredients, setIngredients] = useState<
        { name: string; amount: { metric: { value: number; unit: string } } }[]
    >([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const results = await searchRecipes(searchQuery);
        setRecipes(results);
    };

    const handleRecipeClick = async (id: number) => {
        const ingredients = await getRecipeIngredients(id);
        setIngredients(ingredients);
    };

    return (
        <div className="container recepie-page-container">
            <div className="first">
            <h1>Rezepte und Einkaufslisten</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nach Rezepten suchen..."
                />
                <button type="submit">Suchen</button>
            </form>
            </div>
            <div className="recipes">
                {recipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="recipe-card"
                        onClick={() => handleRecipeClick(recipe.id)}
                    >
                        <h3>{recipe.title}</h3>
                        <img src={recipe.image} alt={recipe.title} />
                    </div>
                ))}
            </div>
            <div className="ingredients">
                {ingredients.length > 0 && (
                    <>
                        <h3>Zutaten</h3>
                        <ul>
                            {ingredients.map((ingredient, index) => (
                                <li key={index}>
                                    {ingredient.amount.metric.value} {ingredient.amount.metric.unit}{' '}
                                    {ingredient.name}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecipesPage;
