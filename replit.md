# Overview

This is a personal portfolio website for Sri Hari Sirisipalli, an AI/ML Engineer specializing in Generative AI, Cloud Infrastructure, and applied R&D. The application is built as a full-stack web application showcasing professional experience, projects, skills, and contact information through an interactive single-page application.

The portfolio highlights expertise in AI/ML technologies, cloud infrastructure (AWS), and various engineering projects spanning defense, industry, and agritech domains. It features sections for about, experience, projects, skills, research, education, leadership activities, and contact information.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing with a single-page application structure
- **Styling**: Tailwind CSS for utility-first styling with a custom dark theme configuration
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **State Management**: TanStack React Query for server state management and data fetching
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for the REST API server
- **Language**: TypeScript throughout the application for consistent type safety
- **Development**: Hot module replacement and development middleware through Vite integration
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage) for user management
- **API Structure**: RESTful API design with `/api` prefix for all backend routes

## Database Design
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Database**: PostgreSQL with Neon serverless database for scalable cloud hosting
- **Schema**: Simple user table with username/password fields, extensible for future features
- **Migrations**: Drizzle-kit for database schema migrations and version control

## Development Workflow
- **Monorepo Structure**: Client and server code in separate directories with shared schema
- **Type Safety**: Shared TypeScript types between frontend and backend via shared directory
- **Build Process**: Separate build processes for client (Vite) and server (esbuild) with production bundling
- **Development Server**: Integrated development environment with Vite middleware and Express backend

## Design System
- **Theme**: Consistent dark theme with CSS custom properties for colors and spacing
- **Typography**: Inter font family for body text, Fira Code for monospace elements
- **Components**: Reusable component architecture with proper separation of concerns
- **Responsive Design**: Mobile-first approach with responsive breakpoints

# External Dependencies

## Core Technologies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection and query execution
- **drizzle-orm**: Type-safe ORM for database operations and query building
- **drizzle-zod**: Schema validation integration between Drizzle and Zod

## Frontend Libraries
- **@tanstack/react-query**: Server state management, caching, and data synchronization
- **@radix-ui/react-**: Complete set of accessible UI primitives for components
- **wouter**: Lightweight routing library for single-page application navigation
- **tailwindcss**: Utility-first CSS framework for styling and responsive design
- **lucide-react**: Icon library providing consistent iconography throughout the application

## Development Tools
- **vite**: Build tool and development server with hot module replacement
- **typescript**: Type checking and compile-time error detection
- **@replit/vite-plugin-**: Replit-specific plugins for development environment integration

## Form Management
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Validation resolver integration for form schemas

## Utilities
- **clsx**: Conditional className utility for dynamic styling
- **class-variance-authority**: Type-safe component variant system
- **date-fns**: Date manipulation and formatting utilities
- **nanoid**: Unique ID generation for various application needs