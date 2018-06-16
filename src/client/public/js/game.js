(function () {
    const [, roomId] = /^\/game\/(.*?)$/.exec(location.pathname);
    
    const socket = io();

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
})();   

var currentRound = 0;
var numberCategories = 0;

function init(data){
    numberCategories = data.room.categories.length;
    
    $("#table-game .thead-light").append("<tr>");
    $("#table-game .thead-light").append("<th style='width: 10%;'></th>");

    data.room.categories.forEach(element => {
        $("#table-game .thead-light").append("<th>" + element.name + "</th>");
    });

    $("#table-game .thead-light").append("<th>Total</th>");
    $("#table-game .thead-light").append("</tr>");
}

function update(data) {
    $("#time-left").html(data.timeLeft / 1000);
}

function newRound(letter){
    currentRound += 1;

    $("#current-letter").html(letter);
    $("#current-round").html(currentRound);

    $("#table-game tbody").append("<tr>");
    $("#table-game tbody").append("<td><input type='text' class='form-control' value='" + letter + "' disabled='disabled'></td>");
    $("#table-game tbody").append("<td><input type='text' class='form-control' placeholder='" + letter + "...'></td>");
    $("#table-game tbody").append("</tr>");
}
