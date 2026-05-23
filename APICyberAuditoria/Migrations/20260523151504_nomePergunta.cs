using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APICyberAuditoria.Migrations
{
    /// <inheritdoc />
    public partial class nomePergunta : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Usuario",
                newName: "Nome");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Empresa",
                newName: "Nome");

            migrationBuilder.AddColumn<string>(
                name: "Nome",
                table: "Perguntas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nome",
                table: "Perguntas");

            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "Usuario",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "Empresa",
                newName: "Name");
        }
    }
}
