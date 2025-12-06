using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NuGet.Next.PostgreSql.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNet10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserKeys",
                keyColumn: "Id",
                keyValue: "d7ff7a0080ec40cf88708be89a7b2ee1");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "c1b0007d-5754-4d0b-ae24-e6e0c97c9ed9");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Avatar", "Email", "FullName", "Password", "PasswordHash", "Role", "Username" },
                values: new object[] { "c1b0007d-5754-4d0b-ae24-e6e0c97c9ed9", "https://avatars.githubusercontent.com/u/61819790?v=4", "239573049@qq.com", "token", "06e8fa784bc3b75087e223900d1be9ac", "bdd18f8f7a964a99a0bee29bec16a040", "admin", "admin" });

            migrationBuilder.InsertData(
                table: "UserKeys",
                columns: new[] { "Id", "CreatedTime", "Enabled", "Key", "UserId" },
                values: new object[] { "d7ff7a0080ec40cf88708be89a7b2ee1", new DateTimeOffset(new DateTime(2024, 11, 2, 22, 45, 32, 566, DateTimeKind.Unspecified).AddTicks(1016), new TimeSpan(0, 8, 0, 0, 0)), true, "key-c86d98a6ea42484ead484552fba0be00", "c1b0007d-5754-4d0b-ae24-e6e0c97c9ed9" });
        }
    }
}
