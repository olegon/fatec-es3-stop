(function() {
    const $administradoresCadastrados = $('#administradores-cadastrados');
    const $novoAdministradorForm = $('#novo-administrador');
    const $username = $('#username');
    const $password = $('#password');
    const $passwordConfirmation = $('#password-confirmation');
    
    function atualizarAdministradoresCadastrados() {
        $administradoresCadastrados.html('<div class="st-loading"></div>');
        
        $.get('/api/backoffice-accounts')
            .done(administradores => {
                $administradoresCadastrados.html('');
    
                for (let administrador of administradores) {
                    const $administrador = $(`<div class="col-md-4 text-center"></div>`);
    
                    $administrador.text(administrador.username);
    
                    $administradoresCadastrados.append($administrador);
                }
            });
    }
    
    $novoAdministradorForm.on('submit', (e) => {
        e.preventDefault();
    
        const username = $username.val();
        const password = $password.val();
        const passwordConfirmation = $passwordConfirmation.val();
    
        if (password !== passwordConfirmation) {
            return alert('Senha diferentes.');
        }
    
        $.post('/api/backoffice-accounts', { username, password })
        .done(() => {
            $username.val('');
            $password.val('');
            $passwordConfirmation.val('');
    
            atualizarAdministradoresCadastrados();
        })
        .fail(err => {
            alert('Erro ao cadastrar administrador.');
        });
    });
    
    $(atualizarAdministradoresCadastrados);
})();