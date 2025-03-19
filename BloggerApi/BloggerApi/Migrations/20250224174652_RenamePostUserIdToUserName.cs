using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BloggerApi.Migrations
{
    /// <inheritdoc />
    public partial class RenamePostUserIdToUserName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Posts",
                newName: "UserName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserName",
                table: "Posts",
                newName: "UserId");
        }
    }
}
