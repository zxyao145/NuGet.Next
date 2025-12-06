using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NuGet.Next.SqlServer.Migrations
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
                keyValue: "4886cfd3e4b74a96a29b214366602252");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "1c83c5c5-1b06-43a1-97a8-b1fd131a8ee6");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Avatar", "Email", "FullName", "Password", "PasswordHash", "Role", "Username" },
                values: new object[] { "1c83c5c5-1b06-43a1-97a8-b1fd131a8ee6", "https://avatars.githubusercontent.com/u/61819790?v=4", "239573049@qq.com", "token", "0a5e25b72026206b454ee76db49847e1", "1cf44bc30d9e45999250415301693235", "admin", "admin" });

            migrationBuilder.InsertData(
                table: "UserKeys",
                columns: new[] { "Id", "CreatedTime", "Enabled", "Key", "UserId" },
                values: new object[] { "4886cfd3e4b74a96a29b214366602252", new DateTimeOffset(new DateTime(2024, 11, 2, 22, 46, 4, 485, DateTimeKind.Unspecified).AddTicks(6718), new TimeSpan(0, 8, 0, 0, 0)), true, "key-520d78f73e454beea64c336a00af919a", "1c83c5c5-1b06-43a1-97a8-b1fd131a8ee6" });
        }
    }
}
