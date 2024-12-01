import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { fetchShoppingLists, searchShoppingLists, getListsByItem } from '../api/api';
import { ShoppingList } from '../types';
import ShoppingListCard from '../components/ShoppingListCard';
import { useNavigate } from 'react-router-dom';
import AddListForm from '../components/AddListForm';
import '../components/styles.css';

const HomePage = () => {
    const { data: shoppingLists, isLoading, refetch } = useQuery<ShoppingList[]>('shoppingLists', fetchShoppingLists);
    
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>(''); // Status for the search query
    const [filteredLists, setFilteredLists] = useState<ShoppingList[] | null>(null); // Status for search results
    const [itemQuery, setItemQuery] = useState<string>(''); // Status for article search

    // Function for executing the search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setFilteredLists(null); // Show all lists if the field is empty
            return;
        }

        try {
            const results = await searchShoppingLists(searchQuery);
            setFilteredLists(results);
        } catch (error) {
            console.error('Fehler bei der Suche:', error);
        }
    };

    // Function for executing the article search
    const handleItemSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemQuery.trim()) {
            setFilteredLists(null);
            return;
        }

        try {
            const results = await getListsByItem(itemQuery);
            setFilteredLists(results);
        } catch (error) {
            console.error('Fehler bei der Suche nach Einkaufslisten mit Artikel:', error);
        }
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="container">
            <AddListForm onListAdded={refetch} />
            <div className="search-form-container">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Einkaufsliste suchen..."
                />
                <button type="submit">Suchen</button>
            </form>

            <form onSubmit={handleItemSearch} className="search-form">
                <input
                    type="text"
                    value={itemQuery}
                    onChange={(e) => setItemQuery(e.target.value)}
                    placeholder="Einkaufslisten mit Artikel suchen..."
                />
                <button type="submit">Artikel suchen</button>
            </form>
            </div>
            <div className="list-container">
                {(filteredLists || shoppingLists)?.map((list) => (
                    <ShoppingListCard
                        key={list.id}
                        list={list}
                        onViewDetails={() => navigate(`/lists/${list.id}`)}
                        onDelete={refetch} // Refreshes the view after deletion
                        onUpdate={refetch} // Refreshes the view after editing
                    />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
