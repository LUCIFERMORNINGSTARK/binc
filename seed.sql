-- Clear existing users to ensure clean state
DELETE FROM users WHERE email IN ('admin@example.com', 'rooban@gmail.com');

-- Insert Admin User (Original)
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('1', 'admin@example.com', '550e8400-e29b-41d4-a716-446655440000:231b586d2ed703fabc6499f919f967005ee0b7d8ac7db5', 'admin', 1706173920000);

-- Insert New User (Provided)
INSERT INTO users (id, email, password_hash, role, created_at) VALUES ('2', 'rooban@gmail.com', 'a1b2c3d4-e5f6-4789-8012-345678901234:561ac376b0e29263d8528d5d4e8e31e1e42b937d3397d01256eecfd9a3689fa3', 'admin', 1706173920000);
