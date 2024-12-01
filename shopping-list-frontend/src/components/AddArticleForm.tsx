import React, { useState } from 'react';
import { addItemToList } from '../api/api';
import './styles.css';

interface AddArticleFormProps {
    listId: number; // The ID of the shopping list to which the item is to be added
    onArticleAdded: () => void; // Callback function that is called when an article is added
}

const AddArticleForm: React.FC<AddArticleFormProps> = ({ listId, onArticleAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [status, setStatus] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !description) {
            setError('Bitte füllen Sie alle Felder aus.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await addItemToList(listId, { name, description, quantity, status });
            onArticleAdded();
            setName('');
            setDescription('');
            setQuantity(1);
            setStatus(false);
        } catch (err) {
            setError('Fehler beim Hinzufügen des Artikels. Bitte versuchen Sie es erneut.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Neuen Artikel hinzufügen</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Artikelname"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Beschreibung</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Artikelbeschreibung"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Menge</label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Bereits gekauft?</label>
                    <input
                        type="checkbox"
                        id="status"
                        checked={status}
                        onChange={(e) => setStatus(e.target.checked)}
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Wird hinzugefügt...' : 'Artikel hinzufügen'}
                </button>
            </form>
        </div>
    );
};

export default AddArticleForm;
