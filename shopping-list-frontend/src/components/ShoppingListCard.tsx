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
    onPriorityChange: (id: number, priority: number) => void;
}

const ShoppingListCard: React.FC<Props> = ({ list, onViewDetails, onDelete, onUpdate, onPriorityChange }) => {

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

    const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const priority = parseInt(e.target.value, 10);
        onPriorityChange(list.id, priority);
    };

    // Determine border color based on priority
    const getBorderColor = (priority: number) => {
        switch (priority) {
            case 1:
                return 'red'; // High priority
            case 2:
                return '#FF9C73'; // Medium priority
            case 3:
                return '#A8CD89'; // Low priority
            default:
                return '#ccc'; // Default
        }
    };

    return (
        <div className="card" style={{ borderColor: getBorderColor(list.priority), borderWidth: '3px', borderStyle: 'solid' }}>
            <h2>{list.name}</h2>
            <p>{list.description}</p>
            <label htmlFor={`priority-${list.id}`}>Priorität:</label>
            <select id={`priority-${list.id}`} value={list.priority} onChange={handlePriorityChange}>
                <option value="1">Hoch</option>
                <option value="2">Mittel</option>
                <option value="3">Niedrig</option>
            </select>
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
