(function () {
    const [, roomId] = /^\/game\/(.*?)$/.exec(location.pathname);
    
    const socket = io();
    let currentRound = 0;
    let numberCategories = 0;
    let numberPlayers = 0;

    socket.emit('join_room', {
        roomId
    });

    socket.on('room_found', (data) => {
        init(data);

        console.log('room_found', data);
    });

    socket.on('room_not_found', (data) => {
        console.log('room_not_found', data);
    });

    socket.on('room_not_active', (data) => {
        console.log('roomt_not_active', data);
    });

    socket.on('server_timer', (data) => {
        update(data);
        
        console.log('server_timer', data);
    });

    socket.on('new_match', (data) => {
        newRound(data.letter);

        console.log('new_match', data);
    });

    function init(data){
        numberCategories = data.room.categories.length;
        
        $("#room-name").html(data.room.name);
        $("#player-id").html(data.room.playerId);

        if (data.room.status == "WAITING_FOR_PLAYERS") {
            $("#match").hide();
            $("#waiting-players").show();
        }

        let headerCategories;

        headerCategories += "<tr>";
        headerCategories += "<th style='width: 10%;'></th>";

        data.room.categories.forEach(element => {
            headerCategories += "<th>" + element.name + "</th>";
        });

        headerCategories += "<th>Total</th>";
        headerCategories += "</tr>";

        $("#table-game .thead-light").append(headerCategories);
    }

    function update(data) {
        $("#time-left").html(data.timeLeft / 1000);

        var playersChange = numberPlayers != data.currentPlayers.length; 

        if (playersChange) {
            numberPlayers = data.currentPlayers.length;
            
            let boxSize = numberPlayers < 2 ? 6 : (12 / numberPlayers);
            let boxPlayers = "";
            
            for (let i = 0; i < numberPlayers; i++){
                boxPlayers += ""
                +"<div class='col-md-" + boxSize + "' style='padding: 0;'>"
                +    "<div class='card stop-player-card'>"
                +        "<div class='card-header'>" + data.currentPlayers[i] + "<span class='player-score'>Pontos: 20&nbsp;&nbsp;<img class='stop-btn-ban-user' src='/public/img/ban-user.png' alt='ban user button' title='Banir usuário.' /></span></div>"
                +        "<div class='card-body'>"
                +            "<div class='text-center'>"
                //+                "<img class='stop-btn-power' src='/public/img/power-stop.png' alt='skill special stop' title='Usar poder stop.' />"
                +                "<img class='stop-btn-power' src='/public/img/power-freeze.png' alt='skill freeze enemy' title='Congelar jogador.' />"
                +            "</div>"
                +        "</div>"
                +    "</div>"
                +"</div>";
            }

            $("#current-players").html(boxPlayers);
        }
    }

    function newRound(letter){
        currentRound += 1;

        $("#current-letter").html(letter);
        $("#current-round").html(currentRound);

        let lineCategory;

        lineCategory += "<tr>";
        lineCategory += "<td><input type='text' class='form-control' value='" + letter + "' disabled='disabled'></td>";
        
        for (var i = 0; i < numberCategories; i++) {
            lineCategory += "<td><input type='text' class='form-control' placeholder='" + letter + "...'></td>";
        }

        lineCategory += "<td>00,00</td>";
        lineCategory += "</tr>";

        $("#table-game tbody tr:last-child :input").attr("disabled", true);
        $("#table-game tbody").append(lineCategory);
    }

})();   