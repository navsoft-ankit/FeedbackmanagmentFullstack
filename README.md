📋 Feedback Management System

A backend system built with ASP.NET Core Web API that allows users to create dynamic feedback forms.
It supports form creation, questions, options, and structured retrieval of form data.

🚀 Features
Create dynamic feedback forms
Add multiple questions per form
Support multiple question types (Text, Dropdown, MCQ, etc.)
Add options for MCQ / Dropdown questions
Retrieve full form with questions & options
Update and delete forms
Clean layered architecture (Controller → Service → Data)
DTO-based API design (no direct entity exposure)
Entity Framework Core integration
🛠️ Tech Stack
ASP.NET Core Web API (.NET 8)
Entity Framework Core
SQL Server
C#
Postman
⚙️ Setup Instructions
1. Clone the repository
git clone https://github.com/navsoft-ankit/FeedbackmanagmentFullstack.git
2. Navigate to backend project
cd src/Authservice
3. Install dependencies
dotnet restore
4. Install EF tool (if not installed)
dotnet tool install --global dotnet-ef
5. Run migrations
dotnet ef migrations add InitialCreate
dotnet ef database update
6. Run the project
dotnet run
