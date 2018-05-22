module.exports = function (RoomModel) {
    return {
        async addRoom(account) {
            return await addRoom(RoomModel, account);
        },
        async getRooms() {
            return await getRooms(RoomModel);
        },
        async getRoomById(id) {
            return await getRoomById(RoomModel, id);
        }
    };
};

async function addRoom(RoomModel, room) {
    const model = new RoomModel({
        ...room,
        active: true
    });

    const savedRoom = await model.save();
    
    return savedRoom;
}

async function getRooms(RoomModel) {
    return await RoomModel
    .find({ active: true }, '_id name categories')
    .populate('categories');
}

async function getRoomById(RoomModel, id) {
    return await RoomModel
    .find({ _id: id, active: true })
    .populate('categories');
}

