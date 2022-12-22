using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace stop_server.Services
{
    public class GameQueueService
    {
        private readonly Channel<GameService> _queue;

        public GameQueueService()
        {
            _queue = Channel.CreateBounded<GameService>(100);
        }

        public ValueTask EnqueueRoom(GameService room)
        {
            return _queue.Writer.WriteAsync(room);
        }

        public async ValueTask<GameService?> DequeueAsync(
        CancellationToken cancellationToken)
        {
            try
            {
                var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                cts.CancelAfter(TimeSpan.FromMilliseconds(10));

                return await _queue.Reader.ReadAsync(cts.Token);
            }
            catch (OperationCanceledException)
            {
                return null;
            }
        }
    }
}