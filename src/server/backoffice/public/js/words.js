(function () {
    const $palavras = $('#palavras-cadastradas');
    const $novaPalavra = $('#nova-palavra');
    const $categoria = $('#categoria');

    function atualizarCategorias() {
        $.get('/api/category')
            .done(categorias => {
                for (let categoria of categorias) {
                    $categoria.append(`<option value="${categoria.name}">${categoria.name}</li>`);
                }
            });
    }

    function atualizarPalavrasCadastradas() {
        $palavras.html('<div class="st-loading"></div>');

        $.get('/api/words')
            .done(palavras => {
                $palavras.html('');

                for (let palavra of palavras) {
                    const $button = $(`<button class="btn btn-danger st-btn-removable" title="Clique para remover.">${palavra.name} (${palavra.category})</button class="btn btn-danger st-btn-removable">`);

                    $button.on('click', function () {
                        $.ajax({
                            method: 'DELETE',
                            url: `/api/words/${palavra._id}`
                        })
                            .done(() => {
                                atualizarPalavrasCadastradas();
                            });
                    });

                    $palavras.append($button);
                }
            });
    }

    $novaPalavra.on('submit', (e) => {
        e.preventDefault();

        const palavra = $('#palavra').val();
        const categoria = $('#categoria').val();

        $.post('/api/words', { name: palavra, category: categoria })
            .done(() => {
                $('#palavra').val('');

                atualizarPalavrasCadastradas();
            })
            .fail(err => {
                alert('Erro ao cadastrar palavra');
            });
    });

    $(atualizarPalavrasCadastradas)
    $(atualizarCategorias);
})();