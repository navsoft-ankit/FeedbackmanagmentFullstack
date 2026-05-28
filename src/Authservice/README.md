# 📋 Feedback Management System

A backend system built with **ASP.NET Core Web API** that allows users to create dynamic feedback forms. It supports form creation, questions, options, and structured retrieval of form data.

---

## 🚀 Features

- Create feedback forms dynamically
- Add multiple questions per form
- Support multiple question types (Text, Dropdown, etc.)
- Add options for MCQ / dropdown questions
- Retrieve full form with questions & options
- Update and delete forms
- Clean layered architecture (Controller → Service → Data)
- DTO-based API design (no direct entity exposure)
- Entity Framework Core integration

---

## 🛠️ Tech Stack

- ASP.NET Core Web API (.NET 8)
- Entity Framework Core
- SQL Server
- C#
- Postman

On a new server you need to run the below commands
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
