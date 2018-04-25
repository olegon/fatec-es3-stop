(function () {
    const $parametros = $('#parametros');
    const $parametrosLoading = $('#parametros-loading');
    const $roundDuration = $('#roundDuration');
    const $maxPlayersByMatch = $('#maxPlayersByMatch');
    const $roundsByMatch = $('#roundsByMatch');

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

        $.ajax({
            method: 'PUT',
            url: '/api/game-parameters',
            contentType: 'application/json',
            data: JSON.stringify({
                roundDuration,
                maxPlayersByMatch,
                roundsByMatch
            })
        })
        .done(obterParametrosNoServidor)
        .fail(() => {
            alert('Ocorreu um erro.');
        });
    });

    $(obterParametrosNoServidor);
})();