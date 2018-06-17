(function () {
    const [, roomId] = /^\/game\/(.*?)$/.exec(location.pathname);
    
    const socket = io();
    let _playerId;
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
        console.log('room_not_found', data);
    });

    socket.on('room_not_active', (data) => {
        console.log('roomt_not_active', data);
    });

    socket.on('round_ended', (data) => {
        console.log('round_ended', data);
    });

    socket.on('match_ended', (data) => {
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

    function init(data){
        _playerId = data.room.playerId;
        _categories = data.room.categories;
        
        $("#room-name").html(data.room.name);
        $("#player-id").html(_playerId);

        if (data.room.status == "WAITING_FOR_PLAYERS") {
            $("#match").hide();
            $("#waiting-players").show();
        } else {
            $("#match").show();
            $("#waiting-players").hide();
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

        _players = data.currentPlayers;
        
        let boxSize = _players.length < 2 ? 6 : Math.floor(12 / _players.length);
        let boxPlayers = "";
        
        for (let i = 0; i < _players.length; i++){
            if (data.currentPlayers[i].playerId == _playerId) {
                boxPlayers += ""
                +"<div class='col-md-" + boxSize + "' style='padding: 0;'>"
                +    "<div class='card text-white bg-info stop-player-card'>"
                +        "<div class='card-header'>" + data.currentPlayers[i].playerId + "<span id='score-"+data.currentPlayers[i].playerId+"' class='player-score'>Pontos: "+data.currentPlayers[i].score+"</span></div>"
                +        "<div class='card-body'>"
                +            "<div class='text-center'>"
                +                "<img class='stop-btn-power' src='/public/img/power-stop.png' alt='skill special stop' title='Usar poder stop.' />"
                +            "</div>"
                +        "</div>"
                +    "</div>"
                +"</div>";
            } else {
                boxPlayers += ""
                +"<div class='col-md-" + boxSize + "' style='padding: 0;'>"
                +    "<div class='card stop-player-card'>"
                +        "<div class='card-header'>" + data.currentPlayers[i].playerId + "<span id='score-"+data.currentPlayers[i].playerId+"' class='player-score'>Pontos: "+data.currentPlayers[i].score+"&nbsp;&nbsp;<img class='stop-btn-ban-user' src='/public/img/ban-user.png' alt='ban user button' title='Banir usuário.' /></span></div>"
                +        "<div class='card-body'>"
                +            "<div class='text-center'>"
                +                "<img class='stop-btn-power' src='/public/img/power-freeze.png' alt='skill freeze enemy' title='Congelar jogador.' />"
                +            "</div>"
                +        "</div>"
                +    "</div>"
                +"</div>";
            }
        }

        $("#current-players").html(boxPlayers);
    }

    function newRound(data){
        $("#match").show();
        $("#waiting-players").hide();

        $("#current-letter").html(data.letter);
        $("#current-round").html(data.currentRound);

        data.currentPlayers.forEach(element => {
            $("score-"+element.playerId).html("Pontos: " + element.score);
        });

        let myScore = data.currentPlayers.filter(item => {
            if(item.playerId == _playerId) return true;
            return false;
        })[0].score;

        let lineCategory;

        lineCategory += "<tr>";
        lineCategory += "<td><input type='text' class='form-control' value='" + data.letter + "' disabled='disabled'></td>";
        
        for (var i = 0; i < _categories.length; i++) {
            lineCategory += "<td><input type='text' class='form-control' data-category='" + _categories[i]._id + "'data-letter='" + data.letter + "' placeholder='" + data.letter + "...'></td>";
        }

        lineCategory += "<td><a type='button' class='btn btn-primary btn-xs' href=''>STOP!</a></td>";
        lineCategory += "</tr>";

        $("#table-game tbody tr:last-child td:last-child").html(myScore);
        $("#table-game tbody tr:last-child :input").attr("disabled", true);
        $("#table-game tbody").append(lineCategory);
    }

})();   