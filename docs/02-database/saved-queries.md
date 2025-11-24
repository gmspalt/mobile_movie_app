# Saved SQL Queries

Complete collection of SQL queries used to set up the Supabase database.

---

## Query 1: Profiles Table & Auth Setup

Sets up user profiles, authentication triggers, and avatar storage.

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Storage!
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');
```

**Notes:**
- The `avatars` bucket was manually set to **public** via Supabase Dashboard after creation
- This enables the profile picture upload feature in the app

---

## Query 2: Events Table & Policies

Creates the events table for the interactive map feature.

```sql
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date_time timestamptz not null,
  location text not null,
  latitude decimal not null,
  longitude decimal not null,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id)
);

-- Enable Row Level Security
alter table events enable row level security;

-- Create policy to allow all authenticated users to read events
create policy "Anyone can view events"
  on events for select
  to authenticated
  using (true);

-- Create policy to allow users to insert their own events
create policy "Users can create events"
  on events for insert
  to authenticated
  with check (auth.uid() = user_id);
```

**Notes:**
- All authenticated users can view all events
- Users can only create events with their own `user_id`
- No UPDATE or DELETE policies currently defined

---

## Query 3: Add events to Events Table

Sample event data for testing the map feature.

```sql
insert into events (title, date_time, location, latitude, longitude, user_id)
  values
    ('Cool Town 9-12', '2025-11-20 21:00:00+00', 'The Seal, Harwich Port', 41.68613802041148, -70.07575693550851, auth.uid()),
    ('Pat Croke 10:30-12:30', '2025-11-21 22:30:00+00', 'The Hot Stove, Harwich Port', 41.66791401882924, -70.07451950435092, auth.uid()),
    ('George Spalt 5-8', '2025-11-22 17:00:00+00', 'Perks, Harwich Port', 41.66773711328425, -70.07520927444699, auth.uid()),
    ('John Dillon 6-9', '2025-11-23 18:00:00+00', 'The Port, Harwich Port', 41.667759906831506, -70.07551360087959, auth.uid());
```

**Notes:**
- These are live music events in Harwich Port, MA
- All events use `auth.uid()` to set the creator
- Coordinates are accurate GPS locations for map markers

---

## Running These Queries

### In Supabase Dashboard:

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste each query
3. Click **Run** to execute
4. Queries can be saved for future reference

### Order of Execution:

1. **First**: Run "Profiles Table & Auth Setup"
2. **Second**: Run "Events Table & Policies"
3. **Third**: Run "Add events to Events Table" (sample data)

---

## Modifying Queries

If you need to update these schemas:

1. Use `ALTER TABLE` statements instead of recreating
2. Be careful with RLS policies - drop old ones before creating new ones
3. Test changes on a development project first

### Example: Adding a column

```sql
alter table events add column description text;
```

### Example: Dropping a policy

```sql
drop policy "Anyone can view events" on events;
```
