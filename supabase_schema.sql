-- Skema Tabel Users untuk Opsi 2 (Custom Table Auth)
-- Jalankan query ini di Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'security')),
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy untuk read (hanya select yang diizinkan untuk verifikasi login / anon dengan key yang sesuai)
-- Catatan: password_hash sebaiknya hanya diverifikasi di server-side Next.js
CREATE POLICY "Allow public read users" ON public.users
    FOR SELECT
    USING (true);

-- Policy untuk insert (hanya diperbolehkan, atau dibatasi sesuai kebutuhan)
CREATE POLICY "Allow public insert users" ON public.users
    FOR INSERT
    WITH CHECK (true);

-- Policy untuk update
CREATE POLICY "Allow public update users" ON public.users
    FOR UPDATE
    USING (true);

-- Masukkan Default Akun Superadmin
-- Password: weSeeSmoker001__
-- Hash di-generate dengan bcrypt (salt 10)
INSERT INTO public.users (username, password_hash, role, name)
VALUES (
    'superadmin-esis',
    '$2b$10$6bfFKEprgzz5HpszxheXYew4mHCopBve1/o9WysQdi603JzVuhXqO',
    'superadmin',
    'Super Admin ESIS'
)
ON CONFLICT (username) 
DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role;
