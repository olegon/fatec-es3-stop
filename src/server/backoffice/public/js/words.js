(function () {
    const $palavras = $('#palavras-cadastradas');
    const $novaPalavra = $('#nova-palavra');
    const $categoria = $('#categoria');
    const $palavra = $('#palavra');
    const $palavraNormalizada = $('#palavra-normalizada');

    function normalizeWord (word) {
        return word
        .toLowerCase()
        .replace(/[áàãâä]/g, 'a')
        .replace(/[éèẽêë]/g, 'e')
        .replace(/[íìĩîï]/g, 'i')
        .replace(/[óòõôö]/g, 'o')
        .replace(/[úùũûü]/g, 'u')
        .replace(/ç/g, 'c')
        .replace(/[^\-\ a-z]/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/\ {2,}/g, ' ')
        .trim();
    }

    function atualizarCategorias() {
        $.get('/api/category')
            .done(categorias => {
                for (let categoria of categorias) {
                    $categoria.append(`<option value="${categoria._id}">${categoria.name}</li>`);
                }
            });
    }

    function atualizarPalavrasCadastradas() {
        $palavras.html('<div class="st-loading"></div>');

        $.get('/api/words')
            .done(palavras => {
                $palavras.html('');

                for (let palavra of palavras) {
                    const $button = $(`<button class="btn btn-danger st-btn-interactive " title="Clique para remover."></button class="btn btn-danger st-btn-interactive ">`);

                    $button.text(`${palavra.normalized_name} (${palavra.category.name})`);

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

    $palavra.on('input', (e) => {
        const palavra = $palavra.val();
        const palavraNormalizada = normalizeWord(palavra);
        $palavraNormalizada.val(`"${palavraNormalizada}"`);
    });

    $novaPalavra.on('submit', (e) => {
        e.preventDefault();

        const palavra = $palavra.val();
        const categoria = $categoria.val();

        $.post('/api/words', { name: palavra, category: categoria })
            .done(() => {
                $palavra.val('');
                $palavraNormalizada.val('');

                atualizarPalavrasCadastradas();
            })
            .fail(err => {
                alert('Erro ao cadastrar palavra');
            });
    });

    $(atualizarPalavrasCadastradas)
    $(atualizarCategorias);
})();