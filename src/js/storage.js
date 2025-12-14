/**
 * Módulo de Persistência de Dados (localStorage)
 */
const Storage = (() => {
    const STORAGE_KEY = 'crud_items_data';

    /**
     * Carrega todos os itens do localStorage.
     * @returns {Array<Object>} Lista de itens.
     */
    const getItems = () => {
        const itemsJson = localStorage.getItem(STORAGE_KEY);
        try {
            return itemsJson ? JSON.parse(itemsJson) : [];
        } catch (error) {
            console.error("Erro ao carregar dados do localStorage:", error);
            return [];
        }
    };

    /**
     * Salva a lista completa de itens no localStorage.
     * @param {Array<Object>} items Lista de itens a serem salvos.
     */
    const saveItems = (items) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    /**
     * Gera um ID único simples (para simular IDs de BD).
     * @returns {string} ID único.
     */
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    /**
     * Adiciona um novo item (C - Create).
     * @param {Object} newItem Dados do novo item (titulo, status).
     * @returns {Array<Object>} Lista atualizada de itens.
     */
    const addItem = (newItem) => {
        const items = getItems();
        newItem.id = generateId();
        items.push(newItem);
        saveItems(items);
        return items;
    };

    /**
     * Atualiza um item existente (U - Update).
     * @param {string} id ID do item a ser atualizado.
     * @param {Object} updatedItem Novos dados do item (titulo, status).
     * @returns {Array<Object>|null} Lista atualizada ou null se não encontrar.
     */
    const updateItem = (id, updatedItem) => {
        const items = getItems();
        const index = items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            // Preserva o ID e sobrescreve as outras propriedades
            items[index] = { ...items[index], ...updatedItem };
            saveItems(items);
            return items;
        }
        return null;
    };

    /**
     * Deleta um item (D - Delete).
     * @param {string} id ID do item a ser deletado.
     * @returns {Array<Object>} Lista atualizada de itens.
     */
    const deleteItem = (id) => {
        const items = getItems();
        const updatedItems = items.filter(item => item.id !== id);
        saveItems(updatedItems);
        return updatedItems;
    };

    return {
        getItems,
        addItem,
        updateItem,
        deleteItem,
    };
})();