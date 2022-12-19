using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using stop_server.Entities;
using stop_server.Repositories;

namespace stop_server.Hubs
{
    public class GameHub : Hub
    {
        private readonly ILogger<GameHub> _logger;
        private readonly StopDbContext _stopDbContext;

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public GameHub(ILogger<GameHub> logger, StopDbContext stopDbContext)
        {
            this._logger = logger;
            this._stopDbContext = stopDbContext;
        }

        [HubMethodName("join_room")]
        public async Task JoinRoom(JoinRoomRequest request)
        {
            _logger.LogInformation("join_room received: {0}", request);

            await Clients.All.SendAsync("broadcast", request);

            var room = await _stopDbContext.Rooms.Where(t => t.ExternalId == request.RoomId).SingleOrDefaultAsync();

            if (room == null)
            {
                await Clients.Caller.SendAsync(
                    "room_not_found",
                    null
                );
            }
            else
            {
                await Clients.Caller.SendAsync(
                    room.Name,
                    new RoomFoundEvent(
                        Player: new RoomFoundEventPlayer(
                            Username: "username_43"
                        ),
                        Room: room
                    )
                );
            }
        }
    }

    public record JoinRoomRequest(string RoomId);
    public record RoomFoundEvent(RoomFoundEventPlayer Player, Room Room);
    public record RoomFoundEventPlayer(string Username);
}