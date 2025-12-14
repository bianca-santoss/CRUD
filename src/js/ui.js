/**
 * Módulo de Interface do Usuário (UI)
 */
const UI = (() => {
    const itemList = document.getElementById('item-list');
    const noItemsMessage = document.getElementById('no-items-message');
    const form = document.getElementById('item-form');
    const titleInput = document.getElementById('item-titulo');
    const statusSelect = document.getElementById('item-status');
    const idInput = document.getElementById('item-id');
    const formButton = document.getElementById('form-button');

    /**
     * Gera o HTML para uma linha de item da tabela.
     * @param {Object} item Dados do item.
     * @returns {string} HTML da linha.
     */
    const createItemRow = (item) => {
        // Formata o status para uso na classe CSS (ex: "Em Andamento" -> "Em-Andamento")
        const statusClass = item.status.replace(/\s/g, '-'); 
        
        return `
            <tr data-id="${item.id}">
                <td data-label="Título">${item.titulo}</td>
                <td data-label="Status">
                    <span class="status-badge status-${statusClass}">${item.status}</span>
                </td>
                <td data-label="Ações">
                    <button class="btn btn-edit" data-id="${item.id}">Editar</button>
                    <button class="btn btn-delete" data-id="${item.id}">Deletar</button>
                </td>
            </tr>
        `;
    };

    /**
     * Renderiza a lista de itens na tabela.
     * @param {Array<Object>} items Lista de itens a serem exibidos.
     */
    const renderItems = (items) => {
        itemList.innerHTML = ''; // Limpa a lista atual
        
        if (items.length === 0) {
            noItemsMessage.style.display = 'block';
            itemList.style.display = 'none';
            return;
        }

        noItemsMessage.style.display = 'none';
        itemList.style.display = 'table-row-group';

        items.forEach(item => {
            itemList.insertAdjacentHTML('beforeend', createItemRow(item));
        });
    };

    /**
     * Atualiza os contadores dinâmicos.
     * @param {Array<Object>} allItems Todos os itens para cálculo.
     */
    const updateCounters = (allItems) => {
        const total = allItems.length;
        const pending = allItems.filter(item => item.status === 'Pendente').length;
        const done = allItems.filter(item => item.status === 'Concluído').length;

        document.getElementById('counter-total').textContent = total;
        document.getElementById('counter-pending').textContent = pending;
        document.getElementById('counter-done').textContent = done;
    };

    /**
     * Prepara o formulário para edição.
     * @param {Object} item Item a ser editado.
     */
    const populateFormForEdit = (item) => {
        idInput.value = item.id;
        titleInput.value = item.titulo;
        statusSelect.value = item.status;
        formButton.textContent = 'Salvar Edição';
        formButton.classList.remove('btn-primary');
        formButton.classList.add('btn-edit');
        titleInput.focus();
    };

    /**
     * Reseta o formulário para adição.
     */
    const resetForm = () => {
        form.reset();
        idInput.value = '';
        formButton.textContent = 'Adicionar Item';
        formButton.classList.remove('btn-edit');
        formButton.classList.add('btn-primary');
    };
    
    /**
     * Exibe uma mensagem de feedback.
     * @param {string} message Mensagem a ser exibida.
     * @param {string} type Tipo da mensagem (ex: 'success', 'error').
     */
    const showMessage = (message, type = 'success') => {
        // Implementação simples de feedback (poderia ser mais avançada com modais/toasts)
        const header = document.querySelector('.app-header');
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        // Estilo básico para o alert
        alert.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; padding: 10px; text-align: center;
            background-color: ${type === 'success' ? '#28a745' : '#dc3545'}; 
            color: white; z-index: 1000; transition: all 0.5s ease-in-out;
        `;
        
        header.insertAdjacentElement('afterend', alert);

        // Remove a mensagem após 3 segundos
        setTimeout(() => alert.remove(), 3000);
    };

    return {
        renderItems,
        updateCounters,
        populateFormForEdit,
        resetForm,
        showMessage,
        form,
        titleInput,
        statusSelect,
        idInput,
        itemList,
    };
})();