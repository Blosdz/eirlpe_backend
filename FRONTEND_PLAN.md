# Frontend Implementation Plan - Admin Panel and RBAC

This document outlines the strategy for implementing the frontend management interface and role-based access control.

## 1. Overview

The goal is to provide a secure and intuitive interface for administrators to manage users and hostnames within the `eirl.pe` platform, while maintaining a standard dashboard for regular users.

## 2. Core Features

### Role-Based Access Control (RBAC)
- **Role Detection**: Decode the JWT returned from `/api/auth/login` to read the `role` claim.
- **Protected Routes**: Implement a `PrivateRoute` or `AdminRoute` component to guard management screens.
- **UI adaptation**: Hide/show menu items and actions based on the user's role.

### Admin Dashboard
- **User Management**:
    - Table view of all platform users.
    - Filter/Search by email.
    - Modal/Form for editing user details (email, role).
    - Confirmation dialog for deleting users.
- **Hostname Management**:
    - Table view of all hostnames.
    - Link to the associated user profile.
    - Edit hostname (changing the subdomain).
    - Delete hostname (with warning about tenant data destruction).

### User Dashboard
- Standard view for users to manage their own hostnames and profiles.

## 3. Component Architecture

### Layouts
- `AdminLayout`: Sidebar with links to "Users", "Hostnames", and "Settings".
- `StandardLayout`: Sidebar focused on user-specific features.

### Components
- `UserList`: Paginated table for user management.
- `HostnameList`: Paginated table for hostname management.
- `EditUserModal`: Form for updating user info.
- `EditHostnameModal`: Form for updating hostname info.

## 4. API Integration

### Auth Module
- Update login logic to store the role in `localStorage` or a state management store (Zustand/Redux).

### Management Module
- `fetchUsers()` -> `GET /api/users`
- `updateUser(id, data)` -> `PATCH /api/users/:id`
- `deleteUser(id)` -> `DELETE /api/users/:id`
- `fetchHostnames()` -> `GET /api/hostnames`
- `updateHostname(id, hostname)` -> `PATCH /api/hostnames/:id`
- `deleteHostname(id)` -> `DELETE /api/hostnames/:id`

## 5. UI/UX Considerations

- **Design System**: Use the existing design system (TailwindCSS) for consistency.
- **Feedback**: Provide toast notifications for success/failure of management actions (delete/edit).
- **Transitions**: Smooth transitions between the login page and the respective dashboards.
