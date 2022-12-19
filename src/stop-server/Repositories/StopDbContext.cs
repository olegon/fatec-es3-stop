using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using stop_server.Entities;

namespace stop_server.Repositories
{
    public class StopDbContext : DbContext
    {
        public StopDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Room> Rooms { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Room>()
                .HasIndex(t => t.ExternalId)
                .IsUnique(true);

            modelBuilder.Entity<Category>()
                .HasIndex(t => t.ExternalId)
                .IsUnique(true);

            modelBuilder.Entity<Category>()
                .HasIndex(t => t.ExternalId)
                .IsUnique(true);
        }
    }
}