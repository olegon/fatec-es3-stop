using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace stop_server.Hubs
{
    public class GameHub : Hub
    {
        private readonly ILogger<GameHub> _logger;

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public GameHub(ILogger<GameHub> logger)
        {
            this._logger = logger;
        }

        [HubMethodName("join_room")]
        public async Task JoinRoom(JoinRoomRequest request)
        {
            _logger.LogInformation("join_room received: {0}", request);

            await Clients.All.SendAsync("broadcast", request);

            await Clients.Caller.SendAsync(
                "room_found",
                new RoomFoundEvent(
                    Player: new RoomFoundEventPlayer(
                        Username: "username_43"
                    ),
                    Room: new RoomFoundEventRoom(
                        Name: "room_name_42",
                        Status: "READY",
                        Categories: new[]
                        {
                            new RoomFoundEventRoomCategory("category_42")
                        }
                    )
                )
            );
        }
    }

    public record JoinRoomRequest(string RoomId);

    public record RoomFoundEvent(RoomFoundEventPlayer Player, RoomFoundEventRoom Room);

    public record RoomFoundEventPlayer(string Username);

    public record RoomFoundEventRoom(string Name, string Status, IReadOnlyCollection<RoomFoundEventRoomCategory> Categories);
    public record RoomFoundEventRoomCategory(string Name);
}