using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using stop_server.Entities;
using stop_server.Models.API.Legacy;
using stop_server.Repositories;
using stop_server.Services;

namespace stop_server.Controllers
{
    [ApiController]
    public class RoomController : Controller
    {
        private readonly StopDbContext _dbContext;
        private readonly GameQueueService _gameQueueService;

        public RoomController(StopDbContext dbContext, GameQueueService gameQueueService)
        {
            _dbContext = dbContext;
            _gameQueueService = gameQueueService;
        }

        [HttpGet("/api/rooms")]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _dbContext.Rooms
                .Include(room => room.Categories)
                .ToArrayAsync();

            var result = rooms.Select(room => new GetRoomResponse(
                    Id: room.ExternalId,
                    Name: room.Name,
                    Categories: room.Categories.Select(category => new GetRoomResponseCategory(
                        Id: category.ExternalId,
                        Name: category.Name
                    ))
                ));

            return Ok(result);
        }

        [HttpPost("/api/rooms")]
        public async Task<IActionResult> CreateRoom(CreateRoomRequest request)
        {
            var categories = await _dbContext.Categories
                .Where(category => request.Categories.Contains(category.ExternalId))
                .ToArrayAsync();

            var room = new Room()
            {
                ExternalId = Guid.NewGuid().ToString(),
                Name = request.Name,
                Status = "CREATED",
                Categories = categories
            };


            _dbContext.Rooms.Add(room);
            await _dbContext.SaveChangesAsync();

            await _gameQueueService.EnqueueRoom(new GameService(
                roomId: room.ExternalId,
                roomName: room.Name

            ));

            return Ok(new CreateRoomResponse(room.ExternalId));
        }
    }
}