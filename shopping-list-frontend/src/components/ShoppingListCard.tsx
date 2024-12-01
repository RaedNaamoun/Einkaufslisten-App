import React, { useState } from 'react';
import './styles.css';
import { ShoppingList } from '../types';
import { deleteShoppingList } from '../api/api';
import UpdateListForm from './UpdateListForm';

interface Props {
    list: ShoppingList;
    onViewDetails: () => void;
    onDelete: () => void;
    onUpdate: () => void; // Callback to update the list view after refreshing
}

const ShoppingListCard: React.FC<Props> = ({ list, onViewDetails, onDelete, onUpdate }) => {

    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm(`Möchten Sie die Liste "${list.name}" wirklich löschen?`)) {
            try {
                await deleteShoppingList(list.id);
                onDelete();
            } catch (error) {
                alert('Fehler beim Löschen der Liste. Bitte versuchen Sie es erneut.');
            }
        }
    };

    return (
        <div className="card">
            <h2>{list.name}</h2>
            <p>{list.description}</p>
            <div className="button-group">
                <button onClick={onViewDetails}>Details ansehen</button>
                <button onClick={handleEdit}>Bearbeiten</button>
                <button className="delete-button" onClick={handleDelete}>Löschen</button>
            </div>
            {isEditing && (
                <UpdateListForm
                    listId={list.id}
                    currentName={list.name}
                    currentDescription={list.description}
                    onUpdate={onUpdate}
                    onClose={handleCloseEdit}
                />
            )}
        </div>
    );
};

export default ShoppingListCard;
