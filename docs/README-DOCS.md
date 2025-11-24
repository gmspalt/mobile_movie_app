# Project Documentation Navigator

This documentation provides a comprehensive overview of the mobile_movie_app (events platform) project.

## 📁 Documentation Structure

### [01-setup/](./01-setup/)
Getting started with the project
- `getting-started.md` - How to run the project
- `environment-variables.md` - Environment configuration
- `dependencies.md` - Package dependencies and versions

### [02-database/](./02-database/)
Supabase database configuration
- `overview.md` - Database architecture overview
- `supabase-config.md` - Supabase project configuration
- `tables-schema.md` - Complete SQL schemas for all tables
- `storage-buckets.md` - Storage bucket configuration
- `rls-policies.md` - Row Level Security policies

### [03-authentication/](./03-authentication/)
Authentication system documentation
- `overview.md` - Authentication architecture
- `auth-flow.md` - Sign in/sign up flow diagrams
- `session-management.md` - How sessions are managed

### [04-features/](./04-features/)
Application features documentation
- `events-map.md` - Interactive events map feature
- `profile-picture.md` - Profile picture upload feature
- `movies-listing.md` - Movie listings (legacy feature)
- `search.md` - Search functionality

### [05-architecture/](./05-architecture/)
Code organization and patterns
- `project-structure.md` - File/folder organization
- `routing.md` - Expo Router setup and navigation
- `contexts.md` - React Context usage
- `services.md` - API services and utilities

### [06-api/](./06-api/)
External services and APIs
- `supabase-api.md` - Supabase API usage patterns
- `movie-api.md` - Movie API integration
- `image-picker.md` - Image picker implementation

## 🚀 Quick Start for New Claude Sessions

When starting a new session:
1. Read `02-database/tables-schema.md` - Understand the database structure
2. Read `03-authentication/overview.md` - Understand auth flow
3. Read `04-features/events-map.md` - Understand main feature
4. Read `05-architecture/project-structure.md` - Understand code organization

## 📝 Updating Documentation

When adding new features:
1. Add new .md file in appropriate category folder
2. Update this README with link to new doc
3. Include code examples and SQL if applicable
