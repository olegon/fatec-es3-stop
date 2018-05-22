module.exports = function (RoomModel) {
    return {
        async addRoom(account) {
            return await addRoom(RoomModel, account);
        },
        async getRooms() {
            return await getRooms(RoomModel);
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
    .find({}, '_id name categories')
    .populate('categories');
}

