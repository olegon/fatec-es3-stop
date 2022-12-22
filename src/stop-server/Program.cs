using Microsoft.EntityFrameworkCore;
using stop_server.Entities;
using stop_server.Hubs;
using stop_server.Models.API.Legacy;
using stop_server.Repositories;
using stop_server.Services;
using stop_server.Workers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<StopDbContext>(options =>
{
    options.UseNpgsql("Host=localhost;Username=abcdef;Password=123456;Database=stop");
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();
builder.Services.AddSingleton<GameQueueService>();
builder.Services.AddHostedService<GameManagerWorker>();
builder.Services.AddSignalR();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(builder =>
    {
        builder.WithOrigins("http://localhost:8080")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.MapControllers();

app.MapHub<GameHub>("/hubs/game");

app.MapGet("/api/category", async (StopDbContext context) =>
{
    var categories = await context.Categories
        .ToArrayAsync();

    return categories.Select(category => new GetCategoryResponse(
        Id: category.ExternalId,
        Name: category.Name
    ));
})
.WithName("Get Categories (legacy)");

// app.MapGet("/api/rooms", async (StopDbContext context) =>
// {
//     var rooms = await context.Rooms
//         .Include(room => room.Categories)
//         .ToArrayAsync();

//     return rooms.Select(room => new GetRoomResponse(
//             Id: room.ExternalId,
//             Name: room.Name,
//             Categories: room.Categories.Select(category => new GetRoomResponseCategory(
//                 Id: category.ExternalId,
//                 Name: category.Name
//             ))
//         ));
// })
// .WithName("Get Rooms (legacy)");

// app.MapPost("/api/rooms", async (StopDbContext context, GameQueueService gameQueueService, CreateRoomRequest request) =>
// {
//     var categories = await context.Categories
//         .Where(category => request.Categories.Contains(category.ExternalId))
//         .ToArrayAsync();

//     var room = new Room()
//     {
//         ExternalId = Guid.NewGuid().ToString(),
//         Name = request.Name,
//         Status = "CREATED",
//         Categories = categories
//     };

//     context.Rooms.Add(room);
//     await context.SaveChangesAsync();

//     await gameQueueService.EnqueueRoom(new GameService(
//         roomId: room.ExternalId,
//         roomName: room.Name
//     ));

//     return new CreateRoomResponse(room.ExternalId);
// })
// .WithName("Create Room (legacy)");

app.Run();
