using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using stop_server.Hubs;
using stop_server.Services;

namespace stop_server.Workers
{
    public class GameManagerWorker : BackgroundService
    {
        private readonly ILogger<GameManagerWorker> _logger;
        private readonly IHubContext<GameHub> _gameHubContext;
        private readonly GameQueueService _gameQueueService;
        private readonly HashSet<GameService> _gameServices;

        public GameManagerWorker(
            ILogger<GameManagerWorker> logger,
            IHubContext<GameHub> gameHubContext,
            GameQueueService gameQueueService
        )
        {
            _logger = logger;
            _gameHubContext = gameHubContext;
            _gameQueueService = gameQueueService;
            _gameServices = new HashSet<GameService>();
        }

        protected override async Task ExecuteAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);

                var roomService = await _gameQueueService.DequeueAsync(cancellationToken);
                _logger.LogInformation("RoomService: {roomService}", roomService);

                if (roomService != null)
                {
                    await _gameHubContext.Clients.All.SendAsync("broadcast", new
                    {
                        Event = "roomServiceAvailable",
                        RoomId = roomService.RoomId
                    });

                    _gameServices.Add(roomService);
                }

                foreach (var gameService in _gameServices.ToList())
                {
                    await gameService.Handle(_gameHubContext , cancellationToken);

                    if (gameService.ItShouldStopRunning())
                    {
                        _gameServices.Remove(gameService);
                    }
                }

                await Task.Delay(1000, cancellationToken);
            }
        }
    }
}