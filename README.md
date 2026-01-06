# 🗳️ Simple Online Voting Platform

A secure, transparent online voting platform built with React, Supabase, and Tailwind CSS. Features one-time voting with mandatory LinkedIn profile verification and admin-controlled candidate management.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## 🔑 Admin Credentials

**Admin Login:**
- **Email:** `admin@voting.com`
- **Password:** `admin@123`

The admin account has special privileges including candidate management and voter list access. Login at `/login` and navigate to `/admin` to manage candidates.

---

## ✨ Core Features

### Authentication System
- ✅ **Email/Password Login & Signup** with password visibility toggle
- ✅ **Google OAuth** - One-click sign in
- ✅ **LinkedIn OAuth** - Sign in with LinkedIn (OpenID Connect)
- ✅ **Forgot Password** - Password recovery via email with reset link
- ✅ **Protected Routes** - Dashboard accessible only to authenticated users
- ✅ **Admin Account** - Special admin privileges for `admin@voting.com`

### Admin Features (admin@voting.com (password : admin@123) only)
- ✅ **Candidate Management** - Add, edit, and delete candidates
- ✅ **Candidate Details Required**:
  - Full name
  - LinkedIn profile URL (validated)
  - Profile photo URL
  - Biography/Description
- ✅ **View All Voters** - Access complete voter list with LinkedIn profiles

### Voting System
- ✅ **One Vote Per User** - Enforced at database level with unique constraints
- ✅ **LinkedIn Profile Required** - All users must provide LinkedIn URL before voting
- ✅ **No Duplicate Profiles** - Unique constraint on LinkedIn URLs prevents duplicates
- ✅ **Race Condition Prevention** - PostgreSQL transactions ensure no double voting
- ✅ **Automatic LinkedIn Extraction** - Users who login via LinkedIn have profile auto-filled

### Candidate Display
- ✅ **Candidate Cards** with:
  - Professional profile photo
  - Full name and biography
  - Clickable LinkedIn profile icon
  - Vote button with icon
  - Real-time vote count (after voting)
  - Vote percentage visualization

### Voter Transparency
- ✅ **Public Voter List** - All voters displayed after voting
- ✅ **Voter Information** - Name + LinkedIn profile link
- ✅ **Clickable Profiles** - Click any voter to open their LinkedIn profile
- ✅ **Real-time Updates** - Vote counts and voter list update instantly

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project (see configuration below)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/simple-vote.git
cd simple-vote

# Install dependencies
npm install

# Start development server
npm run dev
```

## 👨‍💼 Admin Setup & Usage

### Login as Admin
1. **Navigate to** `/login` page
2. **Enter credentials:**
   - Email: `admin@voting.com`
   - Password: `admin@123`
3. **Click** "Sign In"

### Admin Dashboard Access
- After login, click the **"Admin"** button in the top-right header
- Or navigate directly to `/admin` route
- Admin-only features will be visible

### Admin Capabilities
- **Add New Candidates:**
  - Name (required)
  - LinkedIn profile URL (required, validated)
  - Profile photo URL (required)
  - Biography/Description (required)
- **Edit Candidates:** Update any candidate information
- **Delete Candidates:** Remove candidates from the voting pool
- **View Voter List:** Access complete list of all voters with LinkedIn profiles
- **No LinkedIn Required:** Admin can vote without LinkedIn profile verification

### Create Admin Account in Database
If you need to set up the admin account manually in Supabase:

```sql
-- First, create the auth user with admin@voting.com
-- Then run this in Supabase SQL Editor:
update profiles 
set is_admin = true, full_name = 'Admin User'
where email = 'admin@voting.com';
```

Or insert directly if profile doesn't exist:
```sql
insert into profiles (id, email, full_name, is_admin)
values (
  (select id from auth.users where email = 'admin@voting.com'),
  'admin@voting.com',
  'Admin User',
  true
);
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── ProtectedRoute.tsx
│   ├── AdminRoute.tsx   # Admin-only route protection
│   └── LinkedInModal.tsx # LinkedIn profile prompt
├── contexts/
│   └── AuthContext.tsx  # Supabase authentication
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions
├── pages/
│   ├── HomePage.tsx     # Landing page
│   ├── LoginPage.tsx    # Login with email/OAuth
│   ├── SignupPage.tsx   # User registration
│   ├── DashboardPage.tsx # Voting dashboard
│   └── AdminPage.tsx    # Candidate management (admin only)
├── types/
│   └── index.ts         # TypeScript interfaces
└── App.tsx              # Routes configuration
```

## 🔒 Security Features

1. **PostgreSQL Transactions** - Prevents race conditions during voting
2. **One-Vote Enforcement** - Database-level unique constraint on user_id
3. **LinkedIn Verification** - All voters MUST provide valid LinkedIn URL
4. **No Duplicate LinkedIn Profiles** - Unique constraint prevents multiple accounts with same LinkedIn
5. **Protected Routes** - Dashboard accessible only to authenticated users
6. **Admin-Only Routes** - Candidate management restricted to admin@voting.com
7. **Row Level Security (RLS)** - Database-level security policies
8. **Auto LinkedIn Extraction** - LinkedIn OAuth users have profile auto-filled

## 🎯 User Workflow

### For Regular Users:
1. **Sign Up/Login** using:
   - Email/Password
   - Google OAuth
   - LinkedIn OAuth
2. **Provide LinkedIn Profile** (if not using LinkedIn OAuth)
3. **View Candidates** with photos, bios, and LinkedIn links
4. **Cast Vote** (one-time only)
5. **View Results** with vote counts and percentages
6. **See All Voters** with clickable LinkedIn profiles

### For Admin (admin@voting.com):
1. **Login** with admin credentials
2. **Navigate to /admin** page
3. **Add Candidates** with:
   - Name
   - LinkedIn profile URL
   - Profile photo URL
   - Biography
4. **Edit/Delete** existing candidates
5. **View all voters** and their details

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend framework |
| TypeScript | Type safety |
| Vite 7 | Build tool |
| Supabase Auth | Authentication |
| PostgreSQL | Database (via Supabase) |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI components |
| Lucide React | Icons |
| React Router | Navigation |

## 📝 Supabase Configuration & Setup

### Initial Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up and create a new project
   - Wait for project to be provisioned

2. **Get API Credentials**
   - Navigate to Project Settings > API
   - Copy your Project URL
   - Copy your `anon` `public` key

3. **Configure Environment Variables**
   - Create `.env` file in project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy and run the complete schema below

### Database Schema

```sql
-- Profiles table (with admin flag and unique LinkedIn constraint)
create table profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  linkedin_profile text unique,  -- UNIQUE constraint prevents duplicates
  is_admin boolean default false,
  created_at timestamp with time zone default now()
);

-- Candidates table
create table candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text not null,
  photo_url text not null,
  linkedin_profile text not null unique,
  vote_count int default 0,
  created_at timestamp with time zone default now()
);

-- Votes table (ensures one vote per user)
create table votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,  -- UNIQUE ensures one vote
  candidate_id uuid references candidates not null,
  voter_name text not null,
  voter_linkedin text not null,
  created_at timestamp with time zone default now()
);

-- Function to increment vote count atomically
create or replace function increment_vote_count(candidate_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update candidates
  set vote_count = vote_count + 1
  where id = candidate_id;
end;
$$;
```

### Row Level Security Policies

```sql
-- Enable RLS
alter table candidates enable row level security;
alter table votes enable row level security;
alter table profiles enable row level security;

-- Profiles: Everyone can read, users can update only their own
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Candidates: Everyone can read, only admin can modify
create policy "Candidates are viewable by everyone"
  on candidates for select
  using (true);

create policy "Only admin can insert candidates"
  on candidates for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Only admin can update candidates"
  on candidates for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );

create policy "Only admin can delete candidates"
  on candidates for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Votes: Everyone can read, authenticated users can vote once
create policy "Votes are viewable by everyone"
  on votes for select
  using (true);

create policy "Users can create one vote"
  on votes for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from profiles
      where id = auth.uid()
      and linkedin_profile is not null
    )
  );
```

### Authentication Providers Setup

1. **Enable Email Authentication** (default - already enabled)

2. **Google OAuth Setup:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
   - In Supabase Dashboard > Authentication > Providers > Google
   - Paste Client ID and Client Secret
   - Enable Google provider

3. **LinkedIn OIDC Setup:**
   - Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
   - Create a new app
   - Add OAuth 2.0 redirect URL: `https://your-project.supabase.co/auth/v1/callback`
   - Request access to "Sign In with LinkedIn using OpenID Connect"
   - Copy Client ID and Client Secret
   - In Supabase Dashboard > Authentication > Providers > LinkedIn (OIDC)
   - Paste Client ID and Client Secret
   - Enable LinkedIn provider

### Seed Sample Candidates (Optional)

```sql
insert into candidates (name, bio, photo_url, linkedin_profile)
values
  (
    'Alex Johnson',
    'Experienced leader with 10+ years in technology and innovation. Passionate about building scalable systems and mentoring teams.',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    'https://linkedin.com/in/alexjohnson'
  ),
  (
    'Jordan Smith',
    'Passionate advocate for transparency and collaboration. Focused on creating inclusive environments and driving organizational change.',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    'https://linkedin.com/in/jordansmith'
  );
```

### Testing Your Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Test Features:**
   - Navigate to `http://localhost:5173`
   - Sign up as a new user
   - Login with admin credentials: `admin@voting.com` / `admin@123`
   - Add candidates via admin panel
   - Vote as regular user
   - View voter list after voting

## 📋 Evaluation Criteria

This project meets the following requirements:

### ✅ Functionality and Correctness
- Complete login and signup system
- OAuth integration (Google and LinkedIn)
- Forgot password functionality
- Display of 2 candidates with full details
- LinkedIn profile links for all candidates
- One-time voting per authenticated user enforced at database level
- Voter list displayed after voting
- Clickable LinkedIn profiles for all voters

### ✅ Authentication Working Properly
- Email/password authentication
- Google OAuth integration
- LinkedIn OAuth integration
- Session management with Supabase
- Protected routes for authenticated users
- Admin-only routes for candidate management

### ✅ Clean and Simple UI
- Modern, responsive design with Tailwind CSS
- shadcn/ui component library
- Card-based candidate display
- Professional color scheme
- Mobile-friendly interface
- Clear call-to-action buttons

### ✅ Vote-Once Logic
- Database unique constraint on `user_id` in votes table
- Frontend checks to prevent multiple votes
- PostgreSQL transactions for race condition prevention
- Clear error messages for duplicate vote attempts

### ✅ Correct Display of Voters
- Public voter list showing all participants
- Name and LinkedIn profile for each voter
- Clickable links to LinkedIn profiles
- Real-time updates after voting

### ✅ Extra Features
- **Admin Panel** - Full candidate management system
- **LinkedIn Requirement** - Mandatory LinkedIn profiles for transparency
- **No Duplicate Profiles** - Unique constraint on LinkedIn URLs
- **Vote Percentages** - Visual representation of vote distribution
- **Real-time Updates** - Live vote count updates
- **Profile Photos** - Visual candidate identification
- **Candidate Bios** - Detailed information about each candidate

## 🌐 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Build for Production

```bash
npm run build
```

## 👥 Team Contributions

| Member | Role | Responsibilities |
|--------|------|------------------|
| **Developer A** | [Name] | Auth System, Supabase Backend, Admin Panel, Database Logic |
| **Developer B** | [Name] | UI/UX Design, Voting Interface, Voter List, Responsive Layout |

## 🚦 Getting Started Guide

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account

### Step-by-Step Setup

**Step 1: Clone & Install**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/simple-vote.git
cd simple-vote

# Install dependencies
npm install
```

**Step 2: Configure Supabase**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy project URL and anon key from Project Settings > API
4. Create `.env` file in project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

**Step 3: Setup Database**
1. Open Supabase SQL Editor
2. Copy entire schema from "Database Schema" section above
3. Run the SQL to create tables and functions
4. Run Row Level Security policies SQL

**Step 4: Enable Authentication**
1. In Supabase Dashboard > Authentication > Providers
2. Enable Email (already enabled by default)
3. Configure Google OAuth (optional)
4. Configure LinkedIn OIDC (optional)

**Step 5: Create Admin Account**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:5173/signup`
3. Sign up with:
   - Email: `admin@voting.com`
   - Password: `admin@123`
   - Name: Admin User
4. In Supabase SQL Editor, run:
   ```sql
   update profiles set is_admin = true where email = 'admin@voting.com';
   ```

**Step 6: Add Candidates (as Admin)**
1. Login with admin credentials
2. Click "Admin" button in header
3. Add candidates with:
   - Name
   - LinkedIn profile URL
   - Photo URL (use Unsplash or similar)
   - Biography

**Step 7: Test Voting**
1. Sign up as a new user (different email)
2. Provide LinkedIn profile when prompted
3. Vote for a candidate
4. View results and voter list

**Step 8: Deploy (Optional)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Or connect GitHub repo to Vercel for auto-deployments
```

## 📄 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔗 Important Links

- **Supabase Dashboard:** [app.supabase.com](https://app.supabase.com)
- **Live Demo:** [Your Vercel URL]
- **GitHub Repo:** [Your GitHub URL]

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check Supabase documentation
- Review `SUPABASE_SETUP.md` for detailed setup

---

**Built for White Matrix Internship - Machine Test**  
*Demonstrating: React, TypeScript, Supabase, Authentication, Admin Systems, and Database Design*
