using Microsoft.Extensions.DependencyInjection;
using NuGet.Next.Core.Infrastructure;

namespace NuGet.Next.Data;

public class DbSeeder
{
    private readonly IServiceProvider _serviceProvider;

    public DbSeeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }


    /// <summary>
    /// 初始化种子数据
    /// </summary>
    public async Task InitAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<IContext>();
        if (await dbContext.Users.AnyAsync())
        {
            return;
        }

        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Username = "admin",
            Email = "239573049@qq.com",
            Role = RoleConstant.Admin,
            Avatar = "https://avatars.githubusercontent.com/u/61819790?v=4",
            FullName = "token",
        };

        user.SetPassword("Aa123456.");

        await dbContext.Users.AddAsync(user);
        await dbContext.SaveChangesAsync(CancellationToken.None);

        var userKey = new UserKey(user.Id);
        await dbContext.UserKeys.AddAsync(userKey);

        await dbContext.SaveChangesAsync(CancellationToken.None);
    }
}
