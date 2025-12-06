using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NuGet.Next.Sqlite.Migrations
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
                keyValue: "4aeb5cef239e4d449391b64e97f44610");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "16e374d6-13a4-476a-8c8f-3432a378e43b");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Avatar", "Email", "FullName", "Password", "PasswordHash", "Role", "Username" },
                values: new object[] { "16e374d6-13a4-476a-8c8f-3432a378e43b", "https://avatars.githubusercontent.com/u/61819790?v=4", "239573049@qq.com", "token", "38681107d166e47ed9aaab87c86a21a1", "632472d34b5e45b99dfc4bbc8286fcc2", "admin", "admin" });

            migrationBuilder.InsertData(
                table: "UserKeys",
                columns: new[] { "Id", "CreatedTime", "Enabled", "Key", "UserId" },
                values: new object[] { "4aeb5cef239e4d449391b64e97f44610", new DateTimeOffset(new DateTime(2024, 11, 2, 22, 43, 23, 699, DateTimeKind.Unspecified).AddTicks(2195), new TimeSpan(0, 8, 0, 0, 0)), true, "key-37971b1b9fe44e7bb4d1da2836cab187", "16e374d6-13a4-476a-8c8f-3432a378e43b" });
        }
    }
}
