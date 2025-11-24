# Database Tables Schema

Complete SQL schemas for all database tables in the Supabase project.

## Supabase Project Details
- **Project URL**: `https://gmmzprdlvtmbkmegscqv.supabase.co`
- **Project ID**: `gmmzprdlvtmbkmegscqv`

---

## Table: `profiles`

Stores user profile information including avatars and additional user data.

### Schema

```sql
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);
```

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key, references auth.users.id |
| `updated_at` | timestamptz | Last update timestamp |
| `username` | text | Unique username (min 3 chars) |
| `full_name` | text | User's full name |
| `avatar_url` | text | URL to profile picture in storage |
| `website` | text | User's website URL |

### Row Level Security (RLS)

```sql
-- Enable RLS
alter table profiles enable row level security;

-- Public profiles viewable by everyone
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using (true);

-- Users can insert their own profile
create policy "Users can insert their own profile."
  on profiles for insert
  with check ((select auth.uid()) = id);

-- Users can update own profile
create policy "Users can update own profile."
  on profiles for update
  using ((select auth.uid()) = id);
```

### Trigger

Automatically creates profile when user signs up:

```sql
create function public.handle_new_user()
returns trigger
set search_path = ''
as $
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
```

---

## Table: `events`

Stores event information for the interactive map feature.

### Schema

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
```

### Columns

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key, auto-generated |
| `title` | text | Event name/title |
| `date_time` | timestamptz | When the event occurs |
| `location` | text | Address or place name |
| `latitude` | decimal | GPS latitude for map marker |
| `longitude` | decimal | GPS longitude for map marker |
| `created_at` | timestamptz | When record was created |
| `user_id` | uuid | References the user who created the event |

### Row Level Security (RLS)

```sql
-- Enable RLS
alter table events enable row level security;

-- Anyone can view events
create policy "Anyone can view events"
  on events for select
  to authenticated
  using (true);

-- Users can create events
create policy "Users can create events"
  on events for insert
  to authenticated
  with check (auth.uid() = user_id);
```

### Sample Data

Current events in database:

```sql
insert into events (title, date_time, location, latitude, longitude, user_id)
  values
    ('Cool Town 9-12', '2025-11-20 21:00:00+00', 'The Seal, Harwich Port', 41.68613802041148, -70.07575693550851, auth.uid()),
    ('Pat Croke 10:30-12:30', '2025-11-21 22:30:00+00', 'The Hot Stove, Harwich Port', 41.66791401882924, -70.07451950435092, auth.uid()),
    ('George Spalt 5-8', '2025-11-22 17:00:00+00', 'Perks, Harwich Port', 41.66773711328425, -70.07520927444699, auth.uid()),
    ('John Dillon 6-9', '2025-11-23 18:00:00+00', 'The Port, Harwich Port', 41.667759906831506, -70.07551360087959, auth.uid());
```

---

## Storage Buckets

See [storage-buckets.md](./storage-buckets.md) for storage configuration.

---

## Notes

- All timestamps use `timestamptz` (timezone-aware)
- UUIDs are used for primary keys
- RLS is enabled on all public tables
- Foreign keys use `on delete cascade` for automatic cleanup
