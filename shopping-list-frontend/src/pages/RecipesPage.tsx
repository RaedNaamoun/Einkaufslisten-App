import React, { useState } from 'react';
import { searchRecipes, getRecipeIngredients, addRecipeToShoppingList } from '../api/api';
import './styles.css';

const RecipesPage = () => {
    const [recipes, setRecipes] = useState<{ id: number; title: string; image: string }[]>([]);
    const [ingredients, setIngredients] = useState<
        { name: string; amount: { metric: { value: number; unit: string } } }[]
    >([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const results = await searchRecipes(searchQuery);
        setRecipes(results);
    };

    const handleRecipeClick = async (id: number) => {
        const ingredients = await getRecipeIngredients(id);
        setIngredients(ingredients);
        setSelectedRecipeId(id);
    };

    const handleAddToShoppingList = async () => {
        if (!selectedRecipeId || !listName) {
            alert('Bitte geben Sie einen Listennamen ein.');
            return;
        }
        await addRecipeToShoppingList(selectedRecipeId, listName, description);
        alert('Die Zutaten wurden erfolgreich zu einer neuen Einkaufsliste hinzugefügt!');
        setListName('');
        setDescription('');
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
                        <div className="add-list-form">
                            <input
                                type="text"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                placeholder="Name der Einkaufsliste"
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Beschreibung"
                            />
                            <button onClick={handleAddToShoppingList}>
                                Zutaten zur Einkaufsliste hinzufügen
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecipesPage;
