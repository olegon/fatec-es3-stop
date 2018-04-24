const $categorias = $('#categorias-cadastradas');
const $novaCategoria = $('#nova-categoria');

function atualizarCategoriasCadastradas() {
    $categorias.html('<div class="st-loading"></div>');
    
    $.get('/api/category')
        .done(categorias => {
            $categorias.html('');

            for (let categoria of categorias) {
                const $button = $(`<button class="btn btn-danger st-btn-removable" title="Clique para remover.">${categoria.name}</button class="btn btn-danger st-btn-removable">`);

                $button.on('click', function () {
                    $.ajax({
                        method: 'DELETE',
                        url: `/api/category/${categoria._id}`
                    })
                        .done(() => {
                            atualizarCategoriasCadastradas();
                        });
                });

                $categorias.append($button);
            }
        });
}

$novaCategoria.on('submit', (e) => {
    e.preventDefault();

    const nome = $novaCategoria.find('#categoria').val();

    $.post('/api/category', { name: nome })
    .done(() => {
        $novaCategoria.find('#categoria').val('');
        atualizarCategoriasCadastradas();
    })
    .fail(err => {
        alert('Erro ao cadastrar categoria');
    });
});

$(atualizarCategoriasCadastradas)