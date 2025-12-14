/**
 * Módulo Principal da Aplicação (App)
 */
document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos de controle
    const searchInput = document.getElementById('search-input');
    const filterSelect = document.getElementById('filter-status');
    
    let currentItems = []; // Guarda a lista de itens, seja filtrada ou não

    // ------------------------------------
    // Lógica de Busca e Filtro (UX Profissional)
    // ------------------------------------

    /**
     * Aplica a busca por texto e o filtro por status nos itens.
     * @param {Array<Object>} items Lista completa de itens.
     * @returns {Array<Object>} Lista filtrada.
     */
    const applyFilterAndSearch = (items) => {
        const searchText = searchInput.value.toLowerCase().trim();
        const filterStatus = filterSelect.value;

        return items.filter(item => {
            const matchesSearch = item.titulo.toLowerCase().includes(searchText);
            const matchesFilter = filterStatus === 'Todos' || item.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    };

    /**
     * Carrega e renderiza a lista inicial (R - Read).
     * Aplica busca e filtro se houverem valores.
     */
    const loadAndRenderItems = () => {
        const allItems = Storage.getItems();
        currentItems = allItems; // Atualiza a lista completa para o contador

        const filteredItems = applyFilterAndSearch(allItems);
        
        UI.renderItems(filteredItems);
        UI.updateCounters(allItems); // Contador sempre usa *todos* os itens
    };

    // ------------------------------------
    // Lógica do CRUD
    // ------------------------------------

    /**
     * Manipula o envio do formulário (Adicionar ou Editar).
     * @param {Event} e Evento de submit.
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const id = UI.idInput.value;
        const titulo = UI.titleInput.value.trim();
        const status = UI.statusSelect.value;
        
        if (!titulo) {
            UI.showMessage('O campo título é obrigatório.', 'error');
            return;
        }

        const itemData = { titulo, status };
        let updatedItems;

        if (id) {
            // Edição (U - Update)
            updatedItems = Storage.updateItem(id, itemData);
            UI.showMessage('Item atualizado com sucesso!');
        } else {
            // Criação (C - Create)
            updatedItems = Storage.addItem(itemData);
            UI.showMessage('Novo item adicionado com sucesso!');
        }

        UI.resetForm();
        loadAndRenderItems(); // Recarrega a lista com os novos dados
    };

    /**
     * Manipula cliques na lista (Editar e Deletar).
     * @param {Event} e Evento de clique.
     */
    const handleListClick = (e) => {
        const target = e.target;
        const id = target.dataset.id;
        
        if (target.classList.contains('btn-delete')) {
            // Deletar (D - Delete)
            if (confirm('Tem certeza que deseja deletar este item?')) {
                Storage.deleteItem(id);
                UI.showMessage('Item deletado com sucesso!');
                loadAndRenderItems();
            }
        } else if (target.classList.contains('btn-edit')) {
            // Editar - Prepara o formulário
            const itemToEdit = currentItems.find(item => item.id === id);
            if (itemToEdit) {
                UI.populateFormForEdit(itemToEdit);
            }
        }
    };

    // ------------------------------------
    // Event Listeners
    // ------------------------------------
    
    // Formulário (Create/Update)
    UI.form.addEventListener('submit', handleFormSubmit);

    // Lista (Edit/Delete)
    UI.itemList.addEventListener('click', handleListClick);

    // Busca e Filtro (Trigger para a UX)
    searchInput.addEventListener('input', loadAndRenderItems);
    filterSelect.addEventListener('change', loadAndRenderItems);

    // Inicialização da aplicação
    loadAndRenderItems();
});