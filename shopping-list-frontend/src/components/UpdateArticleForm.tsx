import React, { useState } from 'react';
import { updateArticle } from '../api/api';
import './styles.css';

interface UpdateArticleFormProps {
    listId: number;
    articleId: number;
    currentName: string;
    currentDescription: string;
    currentQuantity: number;
    currentStatus: boolean;
    onUpdate: () => void; // Callback to reload the article list after the update
    onCancel: () => void; // Callback to close the form
}

const UpdateArticleForm: React.FC<UpdateArticleFormProps> = ({
    listId,
    articleId,
    currentName,
    currentDescription,
    currentQuantity,
    currentStatus,
    onUpdate,
    onCancel,
}) => {
    const [name, setName] = useState(currentName);
    const [description, setDescription] = useState(currentDescription);
    const [quantity, setQuantity] = useState(currentQuantity);
    const [status, setStatus] = useState(currentStatus);
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
            await updateArticle(listId, articleId, { name, description, quantity, status });
            onUpdate(); // Update the article list
            onCancel(); // Close the form
        } catch (err) {
            setError('Fehler beim Aktualisieren des Artikels. Bitte versuchen Sie es erneut.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form className="update-form" onSubmit={handleSubmit} >
            {error && <p className="error">{error}</p>}
            <div className="form-group">
                <label htmlFor={`name-${articleId}`}>Name</label>
                <input
                    type="text"
                    id={`name-${articleId}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor={`description-${articleId}`}>Beschreibung</label>
                <textarea
                    id={`description-${articleId}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor={`quantity-${articleId}`}>Menge</label>
                <input
                    type="number"
                    id={`quantity-${articleId}`}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                />
            </div>
            <div className="form-group">
                <label htmlFor={`status-${articleId}`}>Bereits gekauft?</label>
                <input
                    type="checkbox"
                    id={`status-${articleId}`}
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                />
            </div>
            <div className="button-group">
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Wird aktualisiert...' : 'Speichern'}
                </button>
                <button type="button" onClick={onCancel}>
                    Abbrechen
                </button>
            </div>
        </form>
    );
};

export default UpdateArticleForm;
