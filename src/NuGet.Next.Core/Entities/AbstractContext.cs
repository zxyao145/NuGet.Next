using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.DependencyInjection;
using NuGet.Next.Core.Infrastructure;

namespace NuGet.Next.Core;

public abstract class AbstractContext<TContext> : DbContext, IContext where TContext : DbContext
{
    public const int DefaultMaxStringLength = 4000;

    public const int MaxPackageIdLength = 128;
    public const int MaxPackageVersionLength = 64;
    public const int MaxPackageMinClientVersionLength = 44;
    public const int MaxPackageLanguageLength = 20;
    public const int MaxPackageTitleLength = 256;
    public const int MaxPackageTypeNameLength = 512;
    public const int MaxPackageTypeVersionLength = 64;
    public const int MaxRepositoryTypeLength = 100;
    public const int MaxTargetFrameworkLength = 256;

    public const int MaxPackageDependencyVersionRangeLength = 256;

    private IUserContext _userContext;

    public AbstractContext(DbContextOptions<TContext> options, IServiceProvider serviceProvider)
        : base(options)
    {
        _userContext = serviceProvider.GetRequiredService<IUserContext>();
    }

    public DbSet<PackageDependency> PackageDependencies { get; set; }
    public DbSet<PackageType> PackageTypes { get; set; }
    public DbSet<TargetFramework> TargetFrameworks { get; set; }

    public DbSet<Package> Packages { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserKey> UserKeys { get; set; }
    public DbSet<PackageUpdateRecord> PackageUpdateRecords { get; set; }

    public virtual async Task RunMigrationsAsync(CancellationToken cancellationToken)
    {
        await Database.MigrateAsync(cancellationToken);
    }

    public abstract bool IsUniqueConstraintViolationException(DbUpdateException exception);

    public virtual bool SupportsLimitInSubqueries => true;

    public Task<int> SaveChangesAsync()
    {
        return SaveChangesAsync(default);
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Package>(BuildPackageEntity);
        builder.Entity<PackageDependency>(BuildPackageDependencyEntity);
        builder.Entity<PackageType>(BuildPackageTypeEntity);
        builder.Entity<TargetFramework>(BuildTargetFrameworkEntity);


        builder.Entity<User>((option) =>
        {
            option.HasKey(x => x.Id);

            option.HasIndex(x => x.Username).IsUnique();

            option.Property(x => x.Username).IsRequired();

            option.Property(x => x.Email).IsRequired(false);
        });

        builder.Entity<UserKey>(option =>
        {
            option.HasKey(x => x.Id);

            option.Property(x => x.Id)
                .ValueGeneratedOnAdd();

            option.Property(x => x.CreatedTime).IsRequired();

            option.Property(x => x.UserId).IsRequired();

            option.HasIndex(x => x.Key).IsUnique();

            option.HasIndex(x => x.UserId);
        });

        builder.Entity<PackageUpdateRecord>(option =>
        {
            option.HasKey(x => x.Id);

            option.Property(x => x.Id).ValueGeneratedOnAdd();

            option.Property(x => x.PackageId).IsRequired();

            option.Property(x => x.Version).IsRequired();

            option.Property(x => x.OperationTime).IsRequired();

            option.Property(x => x.UserId).IsRequired();

            option.Property(x => x.OperationType).IsRequired();

            option.HasIndex(x => x.PackageId);

            option.HasIndex(x => x.UserId);
        });

    }

    private void BuildPackageEntity(EntityTypeBuilder<Package> package)
    {
        package.HasKey(p => p.Key);
        package.HasIndex(p => p.Id);
        package.HasIndex(p => new { p.Id, p.NormalizedVersionString })
            .IsUnique();

        package.Property(p => p.Id)
            .HasMaxLength(MaxPackageIdLength)
            .IsRequired();

        package.Property(p => p.NormalizedVersionString)
            .HasColumnName("Version")
            .HasMaxLength(MaxPackageVersionLength)
            .IsRequired();

        package.Property(p => p.OriginalVersionString)
            .HasColumnName("OriginalVersion")
            .HasMaxLength(MaxPackageVersionLength);

        package.Property(p => p.ReleaseNotes)
            .HasColumnName("ReleaseNotes");

        package.Property(p => p.Authors)
            .HasMaxLength(DefaultMaxStringLength)
            .HasConversion(StringArrayToJsonConverter.Instance)
            .Metadata.SetValueComparer(StringArrayComparer.Instance);

        package.Property(p => p.IconUrl)
            .HasConversion(UriToStringConverter.Instance)
            .HasMaxLength(DefaultMaxStringLength);

        package.Property(p => p.LicenseUrl)
            .HasConversion(UriToStringConverter.Instance)
            .HasMaxLength(DefaultMaxStringLength);

        package.Property(p => p.ProjectUrl)
            .HasConversion(UriToStringConverter.Instance)
            .HasMaxLength(DefaultMaxStringLength);

        package.Property(p => p.RepositoryUrl)
            .HasConversion(UriToStringConverter.Instance)
            .HasMaxLength(DefaultMaxStringLength);

        package.Property(p => p.Tags)
            .HasMaxLength(DefaultMaxStringLength)
            .HasConversion(StringArrayToJsonConverter.Instance)
            .Metadata.SetValueComparer(StringArrayComparer.Instance);

        package.Property(p => p.Description).HasMaxLength(DefaultMaxStringLength);
        package.Property(p => p.Language).HasMaxLength(MaxPackageLanguageLength);
        package.Property(p => p.MinClientVersion).HasMaxLength(MaxPackageMinClientVersionLength);
        package.Property(p => p.Summary).HasMaxLength(DefaultMaxStringLength);
        package.Property(p => p.Title).HasMaxLength(MaxPackageTitleLength);
        package.Property(p => p.RepositoryType).HasMaxLength(MaxRepositoryTypeLength);

        package.Ignore(p => p.Version);
        package.Ignore(p => p.IconUrlString);
        package.Ignore(p => p.LicenseUrlString);
        package.Ignore(p => p.ProjectUrlString);
        package.Ignore(p => p.RepositoryUrlString);

        // TODO: This is needed to make the dependency to package relationship required.
        // Unfortunately, this would generate a migration that drops a foreign key, which
        // isn't supported by SQLite. The migrations will be need to be recreated for this.
        // Consumers will need to recreate their database and reindex all their packages.
        // To make this transition easier, I'd like to finish this change:
        // https://github.com/loic-sharma/BaGet/pull/174
        //package.HasMany(p => p.Dependencies)
        //    .WithOne(d => d.Package)
        //    .IsRequired();

        package.HasMany(p => p.PackageTypes)
            .WithOne(d => d.Package)
            .IsRequired();

        package.HasMany(p => p.TargetFrameworks)
            .WithOne(d => d.Package)
            .IsRequired();

        package.Property(p => p.RowVersion).IsRowVersion();
    }

    private void BuildPackageDependencyEntity(EntityTypeBuilder<PackageDependency> dependency)
    {
        dependency.HasKey(d => d.Key);
        dependency.HasIndex(d => d.Id);

        dependency.Property(d => d.Id).HasMaxLength(MaxPackageIdLength);
        dependency.Property(d => d.VersionRange).HasMaxLength(MaxPackageDependencyVersionRangeLength);
        dependency.Property(d => d.TargetFramework).HasMaxLength(MaxTargetFrameworkLength);
    }

    private void BuildPackageTypeEntity(EntityTypeBuilder<PackageType> type)
    {
        type.HasKey(d => d.Key);
        type.HasIndex(d => d.Name);

        type.Property(d => d.Name).HasMaxLength(MaxPackageTypeNameLength);
        type.Property(d => d.Version).HasMaxLength(MaxPackageTypeVersionLength);
    }

    private void BuildTargetFrameworkEntity(EntityTypeBuilder<TargetFramework> targetFramework)
    {
        targetFramework.HasKey(f => f.Key);
        targetFramework.HasIndex(f => f.Moniker);

        targetFramework.Property(f => f.Moniker).HasMaxLength(MaxTargetFrameworkLength);
    }

    public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess,
        CancellationToken cancellationToken = new CancellationToken())
    {
        await BeforeSaveChanges();
        return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private async Task BeforeSaveChanges()
    {
        var entries = ChangeTracker.Entries().Where(e => e.Entity is ICreatable or IModifiable);

        var packages = new List<(string, Package)>();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    if (entry.Entity is ICreatable creatable)
                    {
                        creatable.CreatedAt = DateTime.Now;
                        if (_userContext.IsAuthenticated)
                        {
                            creatable.Creator = _userContext.UserId;
                        }
                    }

                    break;

                case EntityState.Modified:
                    if (entry.Entity is IModifiable modifiable)
                    {
                        modifiable.UpdatedAt = DateTime.Now;
                        if (_userContext.IsAuthenticated)
                        {
                            modifiable.Modifier = _userContext.UserId;
                        }
                    }

                    break;
            }

            if (entry.Entity is not Package package) continue;
            var type = entry.State switch
            {
                EntityState.Added => "添加新包",
                EntityState.Modified => "更新包",
                EntityState.Deleted => "删除包",
                _ => "未知操作",
            };
            packages.Add((type, package));
        }

        foreach (var item in packages)
        {
            await AddPackageRecordAsync(item.Item2.Id, item.Item2.Version.ToString(), item.Item1);
        }
    }

    public async Task AddPackageRecordAsync(string packageId, string version, string operationType)
    {
        var record = new PackageUpdateRecord
        {
            PackageId = packageId,
            Version = version,
            OperationTime = DateTime.Now,
            UserId = _userContext.UserId,
            OperationType = operationType,
            OperationIP = _userContext.IpAddress,
            OperationDescription = string.Empty,
        };
        await PackageUpdateRecords.AddAsync(record);
    }
}