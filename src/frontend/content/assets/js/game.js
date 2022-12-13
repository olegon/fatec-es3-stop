(async function () {

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5240/game-hub")
        .build();

    await connection.start();

    $(() => {
        // testing signalR
        connection.on("broadcast", data => {
            console.log(data);
        });
    });


    const [, roomId] = /^\/game\/(.*?)$/.exec(location.pathname);

    let _player;
    let _categories = 0;
    let _players = 0;

    connection.invoke('join_room', {
        roomId
    });

    connection.on('room_found', (data) => {
        init(data);

        console.log('room_found', data);
    });

    connection.on('room_not_found', (data) => {
        roomNotFound();

        console.log('room_not_found', data);
    });

    connection.on('room_not_active', (data) => {
        roomNotActive(data);

        console.log('room_not_active', data);
    });

    connection.on('round_ended', (data) => {
        roundEnded(data);

        console.log('round_ended', data);
    });

    connection.on('match_ended', (data) => {
        matchEnded(data);

        console.log('match_ended', data);
    });

    connection.on('server_timer', (data) => {
        update(data);

        console.log('server_timer', data);
    });

    connection.on('new_match', (data) => {
        console.log('new_match', data);
    });

    connection.on('new_round', (data) => {
        newRound(data);

        console.log('new_round', data);
    });






    $("#match").on("change", "input", function (event) {
        let categoryId = $(this).data("category");
        let word = $(this).val();

        connection.invoke('typed_word', {
            category_id: categoryId,
            word: word
        });
    });

    $("#match #table-game").on("click", "#request-stop", function (event) {
        event.preventDefault();

        connection.invoke('stop_request');
    });

    $("#match").on("click", "a[data-power='frozen']", function (event) {
        event.preventDefault();

        let target = $(this).data("target");

        connection.invoke('spell_frost_player', {
            targetId: target
        });
    });

    $("#match").on("click", "a[data-power='confusion']", function (event) {
        event.preventDefault();

        let target = $(this).data("target");

        connection.invoke('spell_confuse_player', {
            targetId: target
        });
    });

    function init(data) {
        _player = data.player;
        _categories = data.room.categories;

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

        headerCategories += "<th>Total Parcial</th>";
        headerCategories += "</tr>";

        $("#table-game .thead-light").append(headerCategories);
    }

    function update(data) {
        $("#time-left").html(data.timeLeft / 1000);
        $("#current-letter").html(data.letter);
        $("#current-round").html(data.currentRound + " / " + data.rounds);

        _player = [...data.currentPlayers, ...data.waitingPlayers].filter(item => {
            if (item.playerId == _player.playerId) { return true; }
            return false;
        })[0];

        if (_player.frozen) {
            $("#div-frozen").show();
            $("#match").hide();
        } else {
            $("#div-frozen").hide();
            $("#match").show();
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

    function newRound(data) {
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
            if (item.playerId == _player.playerId) return true;
            return false;
        })[0].score;

        $("#table-game tbody tr:last-child td:last-child").html(myScore);
        $("#table-game tbody tr:last-child :input").attr("disabled", true);
    }

    function roomNotActive(data) {
        $("#game-message").html(`
        <h2 style="padding-top: 20px; color:black;" class="title">Infelizmente a partida acabou!</h2>
        <img src="/assets/img/emoji-triste.png" style="width: 30vh; padding-top: 20px;" />`);
        $("#game-message").show();
        $("#match").hide();
    }

    function matchEnded(data) {
        _players = data.players;
        updatePlayers();

        _players.sort((a, b) => { return b.score - a.score });

        let resultMatch = `<h4 style="padding-top: 20px;">Partida encerrada!</h4>`;

        _players.forEach(item => {
            resultMatch += `<h3 class="title">` + item.userName + `: ` + item.score + ` pontos</h3>`
        });

        $("#game-message").html(resultMatch);
        $("#game-message").show();
        $("#match").hide();
    }

    function roomNotFound() {
        $("#game-message").html(`
            <h2 style="padding-top: 20px;" class="title">Sala não encontrada</h2>
            <img src="/assets/img/page_not_found.gif" style="width: 65vh" alt="not found" title="Sala não encontrada." />`);
        $("#game-message").show();
        $("#match").hide();
    }

    function updatePlayers() {
        let boxSize = _players.length < 2 ? 6 : Math.floor(12 / _players.length);
        let boxPlayers = "";

        for (let i = 0; i < _players.length; i++) {
            if (_players[i].playerId == _player.playerId) {
                boxPlayers += `
                <div class="col-md-` + boxSize + `" style="padding: 0;">
                    <div class="card text-white bg-info stop-player-card">
                        <div class="card-header">` + _players[i].userName + `<span id="score-` + _players[i].playerId + `" class="player-score">Pontos: ` + _players[i].score + `</span></div>
                        <div class="card-body">
                            <div class="text-center" href="#">
                                <!--<img class="stop-btn-power" src="/assets/img/power-spin.png" alt="skill special stop" title="Usar poder stop." />-->
                            </div>
                        </div>
                    </div>
                </div>`;
            } else {
                boxPlayers += `
                <div class="col-md-` + boxSize + `" style="padding: 0;">
                    <div class="card stop-player-card ${_players[i].frozen ? 'player-is-frozen' : ''} ">
                        <div class="card-header">` + _players[i].userName + `<span id="score-` + _players[i].playerId + `" class="player-score">Pontos: ` + _players[i].score + `&nbsp;&nbsp;</span></div>
                        <div class="card-body">
                            <div class="text-center" style="display: ${_player.canCastFrostPlayer ? 'inline' : 'none'};">
                                <a href="#" data-power="frozen" data-target="` + _players[i].playerId + `">
                                    <img class="stop-btn-power" src="/assets/img/power-freeze.png" alt="skill freeze enemy" title="Congelar jogador." />
                                </a>
                            </div>

                            <div class="text-center" style="display: ${_player.canCastConfusePlayer ? 'inline' : 'none'};">
                                <a href="#" data-power="confusion" data-target="` + _players[i].playerId + `">
                                    <img class="stop-btn-power" src="/assets/img/power-spin.png" alt="skill confuse enemy" title="Confundir jogador." />
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