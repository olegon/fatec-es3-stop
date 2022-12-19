using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace stop_server.Entities
{
    public class Room
    {
        public long? Id { get; set; }
        public string ExternalId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Status { get; set; } = null!;
        [JsonIgnore]
        public IReadOnlyCollection<Category> Categories { get; set; } = null!;
    }
}