using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace stop_server.Hubs
{
    public class NotificationHub : Hub
    {
        private readonly ILogger<NotificationHub> _logger;

        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public NotificationHub(ILogger<NotificationHub> logger)
        {
            this._logger = logger;
        }

        public async Task NotifyAll(Notification notification)
        {
            _logger.LogInformation("NotifyAll received: {0}", notification);

            await Clients.All.SendAsync("NotificationReceived", notification);

            _logger.LogInformation("NotificationReceived sent: {0}", notification);
        }
    }

    public record Notification(string Text);
}