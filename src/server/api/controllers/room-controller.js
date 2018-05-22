const mongoose = require('mongoose');
const Room = mongoose.model('Room');
const roomService = require('../../services/room-service')(Room);

exports.get = async (req, res, next) => {
    try {
        const rooms = await roomService.getRooms();
        
        res.status(200).json(rooms);
        
        next();
    }
    catch (err) {
        res.status(500).json(err);
        next(err);
    }
}

exports.post = async (req, res, next) => {
    try {
        const room = await roomService.addRoom(req.body);
        res.status(200).json(room);
        next();
    }
    catch (err) {
        res.status(500).json(err);
        next(err);
    }
}