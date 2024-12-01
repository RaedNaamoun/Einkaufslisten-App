import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import React, { useState } from 'react';
import { fetchShoppingListItems } from '../api/api';
import { Item } from '../types';
import ArticleCard from '../components/ArticleCard'
import AddArticleForm from '../components/AddArticleForm';
import UpdateArticleForm from '../components/UpdateArticleForm';

const ShoppingListPage = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, refetch } = useQuery<Item[]>(['shoppingListItems', id], () =>
        fetchShoppingListItems(Number(id))
    );

    const [editingArticleId, setEditingArticleId] = useState<number | null>(null);

    const handleEditArticle = (articleId: number) => {
        setEditingArticleId(articleId);
    };

    const handleCancelEdit = () => {
        setEditingArticleId(null);
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="container">
            <AddArticleForm listId={Number(id)} onArticleAdded={refetch} />
            <div className="item-card-container">
            {data?.map((item) => (
                <div key={item.item_id} className="item-card" style={{ backgroundColor: item.status ? '#F1F3C2' : 'white' }}>
                    {editingArticleId === item.item_id ? (
                        <UpdateArticleForm
                            listId={Number(id)}
                            articleId={item.item_id}
                            currentName={item.item_name}
                            currentDescription={item.item_description}
                            currentQuantity={item.quantity}
                            currentStatus={item.status}
                            onUpdate={refetch}
                            onCancel={handleCancelEdit}
                    />
                ) : (
                <ArticleCard
                key={item.item_id}
                item={item}
                id={Number(id)}
                onDelete={refetch}
                onUpdate={handleEditArticle}
            />
                )}
                </div>
            ))}
            </div>
        </div>
    );
};

export default ShoppingListPage;
