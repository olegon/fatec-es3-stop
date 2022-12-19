using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace stop_server.Entities
{
    public class Category
    {
        public long? Id { get; set; }
        public string ExternalId { get; set; } = null!;
        public string Name { get; set; } = null!;
        [JsonIgnore]
        public IReadOnlyCollection<Room> Rooms { get; set; } = null!;
    }
}