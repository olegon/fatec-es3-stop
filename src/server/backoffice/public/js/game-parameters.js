(function () {
    const $parametros = $('#parametros');
    const $parametrosLoading = $('#parametros-loading');
    const $roundDuration = $('#roundDuration');
    const $maxPlayersByMatch = $('#maxPlayersByMatch');
    const $roundsByMatch = $('#roundsByMatch');
    const $availableLetters = $('#availableLetters');
    const allLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function obterParametrosNoServidor() {
        $parametros.fadeOut();
        $parametrosLoading.fadeIn();

        $.get('/api/game-parameters')
        .always(() => {
            $parametrosLoading.fadeOut();
        })
        .done((parameters) => {
            $parametros.fadeIn();

            $roundDuration.val(parameters.roundDuration);
            $maxPlayersByMatch.val(parameters.maxPlayersByMatch);
            $roundsByMatch.val(parameters.roundsByMatch);

            $availableLetters.html('');

            allLetters.forEach(letter => {
                const $button = $(`<button class="btn btn-danger st-btn-letter" title="Letra indisponível">${letter}</button>`);

                $button.data('letter', letter);

                if (parameters.availableLetters.includes(letter)) {
                    $button.removeClass('btn-danger');
                    $button.addClass('btn-success');
                }

                $button.prop('title', $button.hasClass('btn-success') ? 'Letra disponível' : 'Letra indisponível');

                $button.on('click', (e) => {
                    e.preventDefault();

                    $button.toggleClass('btn-danger');
                    $button.toggleClass('btn-success');

                    $button.prop('title', $button.hasClass('btn-success') ? 'Letra disponível' : 'Letra indisponível');
                });

                $availableLetters.append($button);
            });
        })
        .fail((err) => {
            alert('Ocorreu um erro.');
        });
        
    }

    $parametros.on('submit', (e) => {
        e.preventDefault();

        const roundDuration = parseInt($roundDuration.val()) || 1;
        const maxPlayersByMatch = parseInt($maxPlayersByMatch.val()) || 1;
        const roundsByMatch = parseInt($roundsByMatch.val()) || 1;
        const availableLetters = [...$availableLetters.find('button')].filter(btn => $(btn).hasClass('btn-success')).map(btn => $(btn).data('letter'));

        $.ajax({
            method: 'PUT',
            url: '/api/game-parameters',
            contentType: 'application/json',
            data: JSON.stringify({
                roundDuration,
                maxPlayersByMatch,
                roundsByMatch,
                availableLetters
            })
        })
        .done(obterParametrosNoServidor)
        .fail(() => {
            alert('Ocorreu um erro.');
        });
    });

    $(obterParametrosNoServidor);
})();