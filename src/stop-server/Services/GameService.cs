using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using stop_server.Hubs;

namespace stop_server.Services
{
    public class GameService
    {
        public GameService(
            string roomId,
            string roomName
        )
        {
            RoomId = roomId;
            RoomName = roomName;
            Ticks = 0;
        }

        public string RoomId { get; init; }
        public string RoomName { get; init; }
        public int Ticks { get; private set; }


        public async ValueTask Handle(IHubContext<GameHub> gameHubContext, CancellationToken cancellationToken)
        {
            await gameHubContext.Clients.Group(RoomId).SendAsync("broadcast", new
            {
                Event = "tick",
                RoomId = RoomId,
                RoomName = RoomName,
                Ticks = Ticks,
                Timestamp = DateTime.UtcNow
            });

            Ticks++;
        }

        public bool ItShouldStopRunning()
        {
            return Ticks > 300;
        }
    }
}