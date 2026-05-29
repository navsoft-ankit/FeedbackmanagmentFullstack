using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Authservice.Migrations
{
    /// <inheritdoc />
    public partial class FixFeedbackCascadeIssue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRequired",
                table: "Questions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Feedbacks_FormId",
                table: "Feedbacks",
                column: "FormId");

            migrationBuilder.AddForeignKey(
                name: "FK_Feedbacks_FeedbackForms_FormId",
                table: "Feedbacks",
                column: "FormId",
                principalTable: "FeedbackForms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Feedbacks_FeedbackForms_FormId",
                table: "Feedbacks");

            migrationBuilder.DropIndex(
                name: "IX_Feedbacks_FormId",
                table: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "IsRequired",
                table: "Questions");
        }
    }
}
