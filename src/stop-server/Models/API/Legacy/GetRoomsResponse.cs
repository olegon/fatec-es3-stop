using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace stop_server.Models.API.Legacy
{
    public record GetRoomResponse(
        [property:JsonPropertyName("_id")]
        string Id,
        [property:JsonPropertyName("name")]
        string Name,
        [property:JsonPropertyName("categories")]
        IEnumerable<GetRoomResponseCategory> Categories
    );

    public record GetRoomResponseCategory(
        [property:JsonPropertyName("_id")]
        string Id,
        [property:JsonPropertyName("name")]
        string Name
    );
}