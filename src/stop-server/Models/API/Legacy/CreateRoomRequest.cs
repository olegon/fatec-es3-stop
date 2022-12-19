using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace stop_server.Models.API.Legacy
{
    public record CreateRoomRequest(
        [property:JsonPropertyName("name")]
        string Name,
        [property:JsonPropertyName("categories")]
        ISet<string> Categories
    );
}