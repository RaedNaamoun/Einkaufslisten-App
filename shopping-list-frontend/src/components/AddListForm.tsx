import React, { useState } from 'react';
import { createShoppingList } from '../api/api';
import './styles.css';

interface AddListFormProps {
    onListAdded: () => void;
}

const AddListForm: React.FC<AddListFormProps> = ({ onListAdded }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
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
            await createShoppingList(name, description);
            onListAdded(); // Refresh the list view
            setName('');
            setDescription('');
        } catch (err) {
            setError('Fehler beim Hinzufügen der Liste. Bitte versuchen Sie es erneut.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Neue Liste hinzufügen</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name der Liste"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Beschreibung</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Beschreibung der Liste"
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Wird hinzugefügt...' : 'Liste hinzufügen'}
                </button>
            </form>
        </div>
    );
};

export default AddListForm;
