import React from 'react';
import './styles.css';
import { Item } from '../types';
import { deleteArticle } from '../api/api';

interface Props {
    item: Item;
    id: number;
    onDelete: () => void;
    onUpdate: (articleId: number) => void;
}

const ArticleCard: React.FC<Props> = ({ item, id, onDelete, onUpdate }) => {

    const handleUpdate = async () => {
        onUpdate(item.item_id);
    };

    const handleDelete = async () => {
        if (window.confirm(`Möchten Sie den Artikl "${item.item_name}" wirklich löschen?`)) {
            try {
                await deleteArticle(id, item.item_id);
                onDelete(); // Refresh the list view
            } catch (error) {
                alert('Fehler beim Löschen der Liste. Bitte versuchen Sie es erneut.');
            }
        }
    };

    return (
        <div>
                    <h2>{item.item_name}</h2>
                    <p>{item.item_description}</p>
                    <p>Menge: {item.quantity}</p>
                    <p>Zustand: {item.status ? 'Gekauft' : 'Ausstehend'}</p>
                    <button className="delete-button" onClick={handleDelete}>Löschen</button>
                    <button onClick={handleUpdate}>Bearbeiten</button>
        </div>
    );
};

export default ArticleCard;