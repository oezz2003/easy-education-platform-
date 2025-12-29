<p align="center">
  <img src="public/logo.png" alt="EASY EDUCATION Logo" width="200"/>
</p>

<h1 align="center">🎓 EASY EDUCATION</h1>

<p align="center">
  <strong>A Joyful Learning Experience Platform</strong>
</p>

<p align="center">
  <em>Connecting students with specialized teachers through a streamlined, engaging digital experience</em>
</p>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Functional Requirements](#functional-requirements)
- [User Stories](#user-stories)
- [Security & Access Control](#security--access-control)
- [Visual Identity & UI/UX](#visual-identity--uiux)
- [Project Milestones](#project-milestones)
- [Getting Started](#getting-started)

---

## 🌟 Overview

**EASY EDUCATION** is a digital platform designed to connect students with specialized teachers through a streamlined, "Joyful" learning experience. The platform facilitates course exploration, secure content delivery, and manual enrollment management, with a focus on high performance and secure access control via Row Level Security (RLS).

### Project Scope

- 📚 Course discovery and exploration
- 🔐 Secure content delivery
- 👥 Manual enrollment management
- ⚡ High-performance architecture
- 🛡️ Row Level Security (RLS) implementation

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Course Discovery** | Public-facing API to display educational levels, subjects, and teacher previews |
| **Teacher Showcases** | Dedicated pages featuring introductory videos and course catalogs |
| **Secure Content Access** | Protected video lessons and downloadable resources |
| **Progress Tracking** | Visual progress bars and automatic video resume |
| **Manual Enrollment** | Admin-controlled enrollment after payment verification |
| **Role-Based Dashboards** | Customized experiences for Students, Teachers, and Admins |

---

## 👥 User Roles

The system supports three primary user roles, each with a distinct dashboard interface:

### 🎒 Student
- Browse public courses and educational levels
- Request enrollment via administration
- Access protected educational content once approved
- Track learning progress with visual indicators
- Download PDF summaries and attachments

### 👨‍🏫 Teacher
- Manage professional profiles with biography and expertise
- Upload course materials (Videos/PDFs)
- Organize teaching schedules
- Access student enrollment analytics
- Content management with drag-and-drop interface

### 🔧 Administrator
- Central controller for platform management
- Manage academic structure (levels, subjects)
- User role assignment and management
- Manual enrollment activation engine
- Platform-wide analytics and monitoring

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js** (App Router) | Server-Side Rendering (SSR) & SEO optimization |
| **React** | Component-based UI development |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn/UI** | Consistent "Joyful" design system |
| **Framer Motion** | Interactive micro-animations |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Supabase** (PostgreSQL) | Data persistence & real-time features |
| **Supabase Auth** | Email/Password & Google OAuth authentication |
| **Supabase Storage** | Secure file storage for videos & PDFs |
| **RLS Policies** | Row Level Security for data protection |

### Deployment
| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting with automated CI/CD pipelines |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    EASY EDUCATION PLATFORM                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   PUBLIC    │  │  STUDENT    │  │      TEACHER        │ │
│  │  INTERFACE  │  │  DASHBOARD  │  │     DASHBOARD       │ │
│  │             │  │             │  │                     │ │
│  │ • Landing   │  │ • Learning  │  │ • Content Manager   │ │
│  │ • Course    │  │   Path      │  │ • Schedule Manager  │ │
│  │   Preview   │  │ • Progress  │  │ • Student List      │ │
│  │ • Teacher   │  │   Tracking  │  │ • Analytics         │ │
│  │   Profiles  │  │ • Schedule  │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   ADMIN DASHBOARD                       ││
│  │  • User Management  • Academic Structure  • Enrollment  ││
│  │  • Analytics        • Activity Logs       • Moderation  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                      NEXT.JS (APP ROUTER)                   │
│                   Server-Side Rendering (SSR)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │  SUPABASE AUTH │  │   SUPABASE DB  │  │   SUPABASE    │ │
│  │                │  │  (PostgreSQL)  │  │   STORAGE     │ │
│  │ • Email/Pass   │  │                │  │               │ │
│  │ • Google OAuth │  │ • profiles     │  │ • Videos      │ │
│  │ • RBAC         │  │ • courses      │  │ • PDFs        │ │
│  │                │  │ • lessons      │  │ • Assets      │ │
│  │                │  │ • enrollments  │  │               │ │
│  │                │  │ • levels       │  │               │ │
│  │                │  │ • subjects     │  │               │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              ROW LEVEL SECURITY (RLS) POLICIES          ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Functional Requirements

### 3.1 Authentication & Profile Management

| Requirement | Description |
|-------------|-------------|
| **Secure Sign-in** | Supabase Auth with Email/Password and Google OAuth |
| **RBAC** | Automatic role assignment (Student by default) in profiles table |
| **Profile Setup** | Grade and subject interest configuration |

### 3.2 Public Interface (Marketing)

| Requirement | Description |
|-------------|-------------|
| **Course Discovery** | Public API for educational levels, subjects, and teacher previews |
| **Teacher Showcases** | Dedicated pages with introductory videos and course catalogs |
| **Syllabus Preview** | Course content preview without login |

### 3.3 Content Access & Enrollment (Core Logic)

| Requirement | Description |
|-------------|-------------|
| **Conditional Access** | Content hidden by default, accessible only with active enrollment |
| **Manual Activation** | Admin triggers enrollment after external payment verification |
| **In-App Notifications** | Students notified upon enrollment activation |

### 3.4 Dashboard Features

#### Student Dashboard
- "Learning Path" view
- Progress tracking with visual progress bars
- Session schedule
- Lesson completion checkmarks
- "Joyful" celebration on course completion (confetti)

#### Teacher Dashboard
- Content Manager for asset uploads
- Drag-and-drop lesson reordering
- Student list per course
- Basic analytics (enrollments, completion rates)
- Calendar-based schedule management

#### Admin Dashboard
- "Bento Grid" layout for key metrics
- User management (view, role assignment, activation)
- Academic structure management
- Enrollment engine
- Activity logs

---

## 📖 User Stories

### 🎒 Student User Stories

#### Phase 1: Discovery (Public Interface)
- Browse landing page and explore educational levels (Primary, Preparatory, Secondary)
- View teacher profiles and watch introductory videos
- Preview course syllabus and materials

#### Phase 2: Onboarding (Account Creation)
- Create account using Google or Email
- Set up profile with grade and subjects of interest

#### Phase 3: Enrollment & Access
- Request enrollment via "Contact Admin" button (WhatsApp integration)
- Receive in-app notification upon enrollment activation

#### Phase 4: Learning Experience
- Watch high-quality video lessons through seamless player
- Download PDF summaries and attachments
- Automatic progress saving and resume functionality

#### Phase 5: Progress & Achievement (Gamification)
- Visual progress bars for enrolled courses
- "Completed" checkmarks for finished lessons
- "Joyful" celebration (confetti) on 100% course completion

---

### 👨‍🏫 Teacher User Stories

#### Phase 1: Professional Profile & Setup
- Create/manage professional profile with biography and expertise
- Upload introductory video
- Link profile to educational levels and subjects

#### Phase 2: Curriculum & Content Management (CMS)
- Create structured curriculum with courses and lessons
- Upload video lessons and attach PDF resources
- Drag-and-drop interface for lesson reordering

#### Phase 3: Scheduling & Availability
- Manage teaching schedule with calendar view
- Receive alerts for new bookings/cancellations

#### Phase 4: Student Management & Insights
- Access list of enrolled students
- View analytics (enrollments, completion rates)

---

### 🔧 Administrator User Stories

#### Phase 1: User & Role Management
- View comprehensive user list (Students and Teachers)
- Manage and assign user roles
- Activate/deactivate user accounts

#### Phase 2: Academic Content Orchestration
- Define and manage educational levels
- Create and manage subjects linked to levels
- Review and moderate teacher-created courses (Optional for Beta)

#### Phase 3: Manual Enrollment Engine (Core Logic)
- Search students by email or name
- Manually enroll students after payment verification
- View and manage existing enrollments (including revocation)

#### Phase 4: Monitoring & Global Insights
- Access "Bento Grid" dashboard with key metrics
- View activity logs (sign-ups, enrollment activations)

---

## 🔐 Security & Access Control

### Database Level Protection

| Security Feature | Implementation |
|------------------|----------------|
| **RLS Policies** | Users can only access data permitted by their role and enrollment status |
| **Secure Storage** | Private buckets for educational videos to prevent unauthorized sharing |
| **Protected URLs** | Secure signed URLs for video streaming |

### Authentication Security

| Security Feature | Implementation |
|------------------|----------------|
| **OAuth Integration** | Secure Google OAuth flow |
| **Password Security** | Supabase Auth password hashing and validation |
| **Session Management** | Secure JWT-based session handling |
| **Admin API Access** | Protected Supabase Auth Admin API for role management |

---

## 🎨 Visual Identity & UI/UX

### Logo Concept: "The Easy Path"
- Minimalist lowercase "e" with integrated growth arrow
- **Color Gradient**: Royal Green → Yellow

### Design Theme: "Joyful"

| Design Element | Specification |
|----------------|---------------|
| **Corners** | Rounded (border-radius) |
| **Colors** | Vibrant accent colors with green/yellow primary palette |
| **Animations** | Interactive micro-animations (Framer Motion) |
| **Celebrations** | Confetti on course completion |
| **Typography** | Modern, readable fonts |

### UI Components (Shadcn/UI)
- Consistent component library
- Accessible by default
- Customizable theming
- Dark/Light mode support

---

## 📅 Project Milestones

### Timeline Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                     PROJECT TIMELINE                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PHASE 1: Infrastructure                                         │
│  ├─ Setup Supabase Schema                                        │
│  ├─ Implement Authentication                                     │
│  └─ Configure RLS Policies                                       │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  PHASE 2: Core Development                                       │
│  ├─ Build Teacher CMS (Content Management System)                │
│  ├─ Implement Admin Enrollment Engine                            │
│  └─ Develop Dashboard Interfaces                                 │
│                                                                  │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  PHASE 3: Student Experience                                     │
│  ├─ Finalize Student Dashboard                                   │
│  ├─ Implement Learning UI                                        │
│  └─ Add Progress Tracking & Gamification                         │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  📅 DEADLINE: January 15, 2026                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Phase Details

| Phase | Focus Area | Key Deliverables |
|-------|------------|------------------|
| **Phase 1** | Infrastructure | Supabase Schema, Auth, RLS Policies |
| **Phase 2** | Core Development | Teacher CMS, Admin Enrollment Engine |
| **Phase 3** | Student Experience | Student Dashboard, Learning UI |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** with project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/easy-education-platform.git
   cd easy-education-platform/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

Refer to the Supabase migration files for:
- Tables: `profiles`, `courses`, `lessons`, `enrollments`, `levels`, `subjects`
- RLS Policies for each role
- Storage bucket configuration

---

## 📊 Database Schema

```sql
-- Core Tables Overview
├── profiles          -- User profiles with role assignment
├── levels            -- Educational levels (Primary, Preparatory, Secondary)
├── subjects          -- Subjects linked to levels
├── courses           -- Courses created by teachers
├── lessons           -- Individual lessons within courses
├── enrollments       -- Student enrollment records
├── progress          -- Student progress tracking
└── notifications     -- In-app notification system
```

---

## 📞 Contact & Support

For questions, issues, or contributions, please:
- Open an issue on GitHub
- Contact the administrator through the platform

---

<p align="center">
  <strong>Built with ❤️ for Joyful Learning</strong>
</p>

<p align="center">
  <em>© 2024-2026 EASY EDUCATION. All rights reserved.</em>
</p>
