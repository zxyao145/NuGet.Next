# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NuGet Next is a modern private NuGet package management system built with ASP.NET Core (.NET 10) backend and React/TypeScript frontend. It extends BaGet with enhanced user management, package tracking, and support for multiple databases including Chinese domestic databases (DM/达梦).

**Default credentials:**
- Username: `admin`
- Password: `Aa123456.`

## Architecture

### Backend Structure (.NET 10)

The backend follows a modular architecture with clear separation of concerns:

- **NuGet.Next** - Main web application entry point
  - Uses ASP.NET Core Minimal APIs (see `Apis/` folder)
  - Legacy MVC controllers for NuGet protocol compatibility
  - JWT-based authentication with role-based authorization
  - Static file serving for React frontend (`wwwroot/`)

- **NuGet.Next.Core** - Core business logic and services
  - `IPackageService`, `IPackageIndexingService` - Package operations
  - `IAuthenticationService` - API key and JWT authentication
  - `IStorageService` - Abstracted storage (FileSystem, GCP)
  - `ISearchService` - Database-backed search
  - Provider pattern for pluggable implementations (storage, search, database)

- **NuGet.Next.Protocol** - NuGet protocol client library
  - Models for NuGet API responses
  - Catalog processing for upstream mirrors
  - HTTP clients for V2/V3 NuGet feeds

- **Database Providers** - Separate projects for each database:
  - `NuGet.Next.Sqlite` - SQLite (default)
  - `NuGet.Next.PostgreSql` - PostgreSQL
  - `NuGet.Next.SqlServer` - SQL Server
  - `NuGet.Next.DM` - DM (达梦) database
  - `NuGet.Next.MySql` - MySQL (currently commented out)

Each database provider contains Entity Framework Core migrations in `Migrations/` folder.

### Frontend Structure (React + TypeScript)

Built with Vite, React 18, TypeScript, and Ant Design:

- **Routing:** File-based routing with two main layouts:
  - `/app/*` - Regular user interface (packages, upload, settings)
  - `/admin/*` - Admin interface (user management, package management)

- **State Management:** Zustand stores in `src/store/`:
  - `user/` - User authentication, preferences
  - `global/` - Global application state

- **Services:** API clients in `src/services/`:
  - All services use centralized fetch utility with auth headers
  - Services correspond to backend API endpoints

- **Key Features:**
  - Responsive design (Desktop/Mobile layouts in `_layout/` folders)
  - Package browsing, search, upload
  - User and API key management
  - Package update history tracking

### API Routing

The application uses two routing approaches:

1. **NuGet Protocol Routes** (`NuGetNextEndpointBuilder.cs`):
   - `/v3/index.json` - Service index
   - `/v3/search` - Package search
   - `/v3/registration/{id}/index.json` - Package metadata
   - `/v3/package/{id}/{version}/{id}.nupkg` - Package download
   - `/api/v2/package` (PUT) - Package upload

2. **Extended API Routes** (`Apis/ApiExtensions.cs`):
   - `/api/v2/authenticate` - JWT authentication
   - `/api/v3/user/*` - User management (admin only)
   - `/api/v3/user-key/*` - API key management
   - `/api/v3/panel` - Dashboard statistics
   - `/api/v3/package-update-record` - Package history

### Key Patterns

**Provider Pattern:** Multiple implementations of core services (storage, search, database) are registered, and the active implementation is selected based on configuration at runtime.

**Database Seeding:** `DbSeeder` class initializes default admin user on first startup.

**Migration Pattern:** Each database provider maintains its own EF Core migrations. Set `RunMigrationsAtStartup: true` in configuration to auto-migrate.

**Authentication Flow:**
1. User logs in via `/api/v2/authenticate` with username/password
2. Backend validates credentials and returns JWT token
3. Frontend stores token and includes in Authorization header
4. Backend validates JWT and extracts user context via `IUserContext`

## Development Commands

### Backend (.NET)

Build the solution:
```bash
dotnet build NuGet.Next.sln
```

Run the backend (from repository root):
```bash
cd src/NuGet.Next
dotnet run
```

The backend runs on `http://localhost:5228` by default (see `Properties/launchSettings.json`).

Publish for Windows x64:
```bash
build.bat
```
Or manually:
```bash
dotnet publish src/NuGet.Next/NuGet.Next.csproj -c Release -o ./artifacts/NuGet.Next/win-x64 --self-contained --runtime win-x64
```

Create database migration (example for PostgreSQL):
```bash
cd src/NuGet.Next.PostgreSql
dotnet ef migrations add MigrationName --context PostgreSqlContext
```

### Frontend (React)

All frontend commands run from `/web` directory.

Install dependencies:
```bash
pnpm install
```

Run development server:
```bash
pnpm dev
```
This starts Vite dev server on `http://localhost:5173` with proxy to backend at `http://localhost:5228`.

Build for production:
```bash
pnpm build
```
Output goes to `web/dist/` which is copied to `src/NuGet.Next/wwwroot/` for deployment.

Lint code:
```bash
pnpm lint
```

Preview production build:
```bash
pnpm preview
```

### Docker

Build and run with Docker Compose:
```bash
docker-compose up -d
```

The application will be available at `http://localhost:5000`.

## Configuration

Configuration uses ASP.NET Core's hierarchical configuration system (appsettings.json, environment variables).

Key configuration sections in `appsettings.json`:

- `Database:Type` - Database provider (Sqlite, PostgreSql, SqlServer, DM, MySql)
- `Database:ConnectionString` - Database connection string
- `Mirror:Enabled` - Enable upstream mirroring from nuget.org
- `Mirror:PackageSource` - Upstream NuGet feed URL
- `RunMigrationsAtStartup` - Auto-migrate database on startup (set to `true` for first run)
- `Storage:Type` - Storage backend (Filesystem, GCP, Null)
- `Storage:Path` - File storage path for packages
- `PathBase` - Base path for reverse proxy scenarios

Environment variable format: Use double underscore for nested sections:
```
Database__Type=PostgreSql
Database__ConnectionString=Host=localhost;Database=nuget
```

## Working with Databases

When adding features that modify the database schema:

1. Update entity models in `NuGet.Next.Core/Entities/`
2. Create migrations for ALL database providers:
   ```bash
   cd src/NuGet.Next.Sqlite && dotnet ef migrations add YourMigrationName --context SqliteContext
   cd src/NuGet.Next.PostgreSql && dotnet ef migrations add YourMigrationName --context PostgreSqlContext
   cd src/NuGet.Next.SqlServer && dotnet ef migrations add YourMigrationName --context SqlServerContext
   cd src/NuGet.Next.DM && dotnet ef migrations add YourMigrationName --context DMContext
   ```
3. Each database context has different naming conventions and constraints

## Frontend Development Notes

- **API Proxy:** Vite dev server proxies `/api` and `/v3` requests to `http://localhost:5228`
- **Path Alias:** `@` is aliased to `src/` in vite.config.ts
- **Routing:** Uses react-router-dom v6 with route definitions in `src/routes/index.tsx`
- **Styling:** Uses Ant Design components with `antd-style` for CSS-in-JS
- **Icons:** Lucide React icons and Ant Design icons

## Backend Development Notes

- **API Documentation:** Swagger UI available at `/swagger` in development mode
- **Endpoint Filters:** `ExceptionFilter` handles global error responses
- **Authorization:** Use `[Authorize]` attribute or check `IUserContext` in API handlers
- **File Uploads:** Max request body size configured via `RequestSizeLimit` (default 100MB)
- **Response Compression:** Enabled globally for all responses

## Common Tasks

**Adding a new API endpoint:**
1. Create API handler class in `src/NuGet.Next/Apis/` (e.g., `MyFeatureApis.cs`)
2. Register routes in `ApiExtensions.MapApis()`
3. Add corresponding service method in `src/NuGet.Next.Core/`
4. Create TypeScript service in `web/src/services/`
5. Add UI components in `web/src/app/` or `web/src/admin/`

**Adding authentication to an endpoint:**
Use `IUserContext` to access the current authenticated user:
```csharp
public async Task<IResult> MyProtectedEndpoint([FromServices] IUserContext userContext)
{
    var user = await userContext.GetCurrentUserAsync();
    if (user == null) return Results.Unauthorized();
    // ... protected logic
}
```

**BaGet Compatibility:**
When modifying NuGet protocol endpoints, ensure backward compatibility with NuGet clients. The legacy MVC controllers in `NuGetNextEndpointBuilder` must continue to work.
