-- Enable Row Level Security (RLS) for all tables
-- This ensures users can ONLY see their own data

-- 1. Create Profiles Table (extends basic auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  phone text unique,
  updated_at timestamp with time zone,
  
  constraint phone_length check (char_length(phone) >= 10)
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. Create Shops Table
create table shops (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users not null,
  name text not null,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table shops enable row level security;
-- Policy: Only the owner can see, update, delete their shop
create policy "Users can view own shop" on shops for select using (auth.uid() = owner_id);
create policy "Users can insert own shop" on shops for insert with check (auth.uid() = owner_id);
create policy "Users can update own shop" on shops for update using (auth.uid() = owner_id);

-- 3. Create Products Table
create table products (
  id uuid default gen_random_uuid() primary key,
  shop_id uuid references shops on delete cascade not null,
  owner_id uuid references auth.users not null,
  name text not null,
  price numeric not null check (price >= 0),
  stock integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;
create policy "Users can manage own products" on products for all using (auth.uid() = owner_id);

-- 4. Create Bills Table
create table bills (
  id uuid default gen_random_uuid() primary key,
  shop_id uuid references shops on delete cascade not null,
  owner_id uuid references auth.users not null,
  customer_phone text,
  total_amount numeric not null,
  payment_mode text check (payment_mode in ('cash', 'upi', 'credit')),
  items jsonb, -- Storing line items as JSON for MVP simplicity
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table bills enable row level security;
create policy "Users can manage own bills" on bills for all using (auth.uid() = owner_id);

-- 5. Trigger to create Profile on Signup
-- This automatically creates a row in 'profiles' when a new user signs up via SMS/Email
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
