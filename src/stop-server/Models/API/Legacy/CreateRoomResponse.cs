using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace stop_server.Models.API.Legacy
{
    public record CreateRoomResponse(
        [property:JsonPropertyName("_id")]
        string Id
    );
}