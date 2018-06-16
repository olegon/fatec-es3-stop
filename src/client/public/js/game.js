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
    $("#table-game tbody").append(lineCategory);
}
