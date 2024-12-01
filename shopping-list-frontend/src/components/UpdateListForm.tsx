import React, { useState } from 'react';
import { updateShoppingList } from '../api/api';
import './styles.css';

interface UpdateListFormProps {
    listId: number;
    currentName: string;
    currentDescription: string;
    onUpdate: () => void; // Callback function that is called when the list has been updated
    onClose: () => void;
}

const UpdateListForm: React.FC<UpdateListFormProps> = ({
    listId,
    currentName,
    currentDescription,
    onUpdate,
    onClose,
}) => {
    const [name, setName] = useState(currentName);
    const [description, setDescription] = useState(currentDescription);
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
            await updateShoppingList(listId, { name, description });
            onUpdate(); // Refresh the list view
            onClose();
        } catch (err) {
            setError('Fehler beim Aktualisieren der Liste. Bitte versuchen Sie es erneut.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container Update-list-form">
            <h2>Liste bearbeiten</h2>
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
                    {isSubmitting ? 'Wird aktualisiert...' : 'Speichern'}
                </button>
                <button type="button" onClick={onClose}>
                    Abbrechen
                </button>
            </form>
        </div>
    );
};

export default UpdateListForm;
