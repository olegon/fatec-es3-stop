(function () {
    const [, roomId] = /^\/game\/(.*?)$/.exec(location.pathname);
    
    const socket = io();
    let _player;
    let _categories = 0;
    let _players = 0;

    socket.emit('join_room', {
        roomId
    });

    socket.on('room_found', (data) => {
        init(data);

        console.log('room_found', data);
    });

    socket.on('new_round', (data) => {
        newRound(data);
        
        console.log('new_round', data);
    });

    socket.on('room_not_found', (data) => {
        roomNotFound();

        console.log('room_not_found', data);
    });

    socket.on('room_not_active', (data) => {
        roomNotActive(data);
        
        console.log('room_not_active', data);
    });

    socket.on('round_ended', (data) => {
        roundEnded(data);
        
        console.log('round_ended', data);
    });

    socket.on('match_ended', (data) => {
        matchEnded(data);
        
        console.log('match_ended', data);
    });

    socket.on('server_timer', (data) => {
        update(data);
        
        console.log('server_timer', data);
    });

    socket.on('new_match', (data) => {
        console.log('new_match', data);
    });

    $("#match").on("change", "input", function(event){
        let categoryId = $(this).data("category");
        let word = $(this).val();
        
        socket.emit('typed_word', {
            category_id: categoryId,
            word: word
        });
    });

    $("#match #table-game").on("click", "#request-stop", function(event){
        event.preventDefault();
        
        socket.emit('stop_request');
    });

    $("#match").on("click", "a[data-power='frozen']", function(event){
        event.preventDefault();
        
        let target = $(this).data("target");

        socket.emit('spell_frost_player', {
            targetId: target
        });
    });

    $("#match").on("click", "a[data-power='confusion']", function(event){
        event.preventDefault();
        
        let target = $(this).data("target");
        
        socket.emit('spell_confuse_player', {
            targetId: target
        });
    });

    function init(data){
        _categories = data.room.categories;
        _player = data.room.players.filter(item => {
            if (item.playerId == data.room.playerId) {return true;}
            return false;
        })[0];
        
        $("#room-name").html(data.room.name);
        $("#player-id").html(_player.userName);

        if (data.room.status != "WAITING_FOR_PLAYERS") {
            $("#match").show();
            $("#game-message").hide();
        }

        let headerCategories;

        headerCategories += "<tr>";
        headerCategories += "<th style='width: 10%;'></th>";

        _categories.forEach(element => {
            headerCategories += "<th>" + element.name + "</th>";
        });

        headerCategories += "<th>Total</th>";
        headerCategories += "</tr>";

        $("#table-game .thead-light").append(headerCategories);
    }

    function update(data) {
        $("#time-left").html(data.timeLeft / 1000);
        $("#current-letter").html(data.letter);
        $("#current-round").html(data.currentRound + " / " + data.rounds);

        _player = data.currentPlayers.filter(item => {
            if (item.playerId == _player.playerId) {return true;}
            return false;
        })[0];

        if (_player.frozen) {
            $("#div-frozen").show();
        } else {
            $("#div-frozen").hide();
        }

        if (_player.confused) {
            $('body').addClass('confusion-applied');
        }
        else {
            $('body').removeClass('confusion-applied');
        }

        _players = data.currentPlayers;
        updatePlayers();
    }

    function newRound(data){
        $("#game-message").hide();
        $("#match").show();

        data.currentPlayers.forEach(element => {
            $("score-" + element.playerId).html("Pontos: " + element.score);
        });

        let lineCategory;

        lineCategory += "<tr>";
        lineCategory += "<td><input type='text' class='form-control' value='" + data.letter + "' disabled='disabled'></td>";
        
        for (var i = 0; i < _categories.length; i++) {
            lineCategory += "<td><input type='text' class='form-control' data-category='" + _categories[i]._id + "'data-letter='" + data.letter + "' placeholder='" + data.letter + "...'></td>";
        }

        lineCategory += "<td><a id='request-stop' type='button' class='btn btn-primary btn-xs' href='#'>STOP!</a></td>";
        lineCategory += "</tr>";

        
        $("#table-game tbody").append(lineCategory);
    }


    function roundEnded(data) {
        let myScore = data.currentPlayers.filter(item => {
            if(item.playerId == _player.playerId) return true;
            return false;
        })[0].score;

        $("#table-game tbody tr:last-child td:last-child").html(myScore);
        $("#table-game tbody tr:last-child :input").attr("disabled", true);
    }

    function roomNotActive(data) {
        $("#game-message").html(`
        <h4 style="padding-top: 20px;">Infelizmente a partida acabou!</h4>
        <img src="/public/img/emoji-triste.png" style="width: 30vh; padding-top: 20px;" />`);
        $("#game-message").show();
        $("#match").hide();
    }

    function matchEnded(data) {
        _players = data.players;
        updatePlayers();

        _players.sort((a, b) => {return b.score-a.score});
        
        let resultMatch = `<h4 style="padding-top: 20px;">Partida encerrada!</h4>`;

        _players.forEach(item => {
            resultMatch += `<h3 class="title">` + item.userName + `: ` + item.score + `</h3>`
        });

        $("#game-message").html(resultMatch);
        $("#game-message").show();
        $("#match").hide();
    }

    function roomNotFound() {
        $("#game-message").html(`
            <h4 style="padding-top: 20px;">Sala não encontrada</h4>
            <img src="/public/img/page_not_found.gif" style="width: 65vh" alt="not found" title="Sala não encontrada." />`);
        $("#game-message").show();
        $("#match").hide();
    }

    function updatePlayers() {
        let boxSize = _players.length < 2 ? 6 : Math.floor(12 / _players.length);
        let boxPlayers = "";

        for (let i = 0; i < _players.length; i++){
            if (_players[i].playerId == _player.playerId) {
                boxPlayers += `
                <div class="col-md-` + boxSize + `" style="padding: 0;">
                    <div class="card text-white bg-info stop-player-card">
                        <div class="card-header">` + _players[i].userName + `<span id="score-`+_players[i].playerId+`" class="player-score">Pontos: ` + _players[i].score + `</span></div>
                        <div class="card-body">
                            <div class="text-center" href="#">
                                <!--<img class="stop-btn-power" src="/public/img/power-stop.png" alt="skill special stop" title="Usar poder stop." />-->
                            </div>
                        </div>
                    </div>
                </div>`;
            } else {
                boxPlayers += `
                <div class="col-md-` + boxSize + `" style="padding: 0;">
                    <div class="card stop-player-card ${_players[i].frozen ? 'player-is-frozen' : ''} ">
                        <div class="card-header">` + _players[i].userName + `<span id="score-` + _players[i].playerId + `" class="player-score">Pontos: ` + _players[i].score + `&nbsp;&nbsp;<img class="stop-btn-ban-user" src="/public/img/ban-user.png" alt="ban user button" title="Banir usuário." /></span></div>
                        <div class="card-body">
                            <div class="text-center" style="display: ${_player.canCastFrostPlayer ? 'inline' : 'none'};">
                                <a href="#" data-power="frozen" data-target="` + _players[i].playerId + `">
                                    <img class="stop-btn-power" src="/public/img/power-freeze.png" alt="skill freeze enemy" title="Congelar jogador." />
                                </a>
                            </div>

                            <div class="text-center" style="display: ${_player.canCastConfusePlayer ? 'inline' : 'none'};">
                                <a href="#" data-power="confusion" data-target="` + _players[i].playerId + `">
                                    <img class="stop-btn-power" src="/public/img/power-stop.png" alt="skill confuse enemy" title="Confundir jogador." />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>`;
            }
        }

        $("#current-players").html(boxPlayers);
    }
})();   