DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS meeting_requests CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ENGINEER', 'HEALTHCARE', 'ADMIN')),
    institution VARCHAR(255),
    bio TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_VERIFICATION'
        CHECK (status IN ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DEACTIVATED')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    needed_expertise VARCHAR(255) NOT NULL,
    working_domain VARCHAR(100) NOT NULL,
    project_stage VARCHAR(50) NOT NULL
        CHECK (project_stage IN ('IDEA', 'PROTOTYPE', 'RESEARCH')),
    collaboration_type VARCHAR(50) NOT NULL
        CHECK (collaboration_type IN ('ADVISOR', 'CO_FOUNDER', 'RESEARCH_PARTNER')),
    commitment_level VARCHAR(50) NOT NULL
        CHECK (commitment_level IN ('PART_TIME', 'FULL_TIME', 'FLEXIBLE')),
    confidentiality_level VARCHAR(50) NOT NULL
        CHECK (confidentiality_level IN ('LOW', 'MEDIUM', 'HIGH')),
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'ACTIVE', 'MEETING_SCHEDULED', 'PARTNER_FOUND', 'EXPIRED')),
    expiry_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE meeting_requests (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    nda_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'ACKNOWLEDGED', 'ACCEPTED', 'DECLINED', 'SCHEDULED', 'CANCELLED')),
    proposed_time_slots TEXT,
    selected_time_slot TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMP
);

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    result_status VARCHAR(50) NOT NULL,
    ip_address VARCHAR(50),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_city ON posts(city);
CREATE INDEX idx_posts_country ON posts(country);
CREATE INDEX idx_meeting_requests_post_id ON meeting_requests(post_id);
CREATE INDEX idx_meeting_requests_requester_id ON meeting_requests(requester_id);
CREATE INDEX idx_meeting_requests_receiver_id ON meeting_requests(receiver_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_timestamp ON activity_logs(timestamp);

-- SEED MOCK DATA 
INSERT INTO users (full_name, email, password_hash, role, institution, status, email_verified)
VALUES (
  'HealthAI System Bot', 
  'bot@healthai.dev', 
  '$2b$10$tZ2c/t0XG3.yM20iH/qT0uV6JtZ.L1b1N2TjK.Z0O0X.K1H.T2M2G', -- hashed password
  'ENGINEER', 
  'HealthAI Lab', 
  'ACTIVE', 
  true
) ON CONFLICT DO NOTHING;

INSERT INTO posts (author_id, title, description, needed_expertise, working_domain, project_stage, collaboration_type, commitment_level, confidentiality_level, city, country, status)
VALUES 
  ((SELECT id FROM users WHERE email='bot@healthai.dev'), 'AI Lung Cancer Detection', 'Looking for an expert radiologist to collaborate tightly on refining a ResNet model for identifying early-stage lung nodules. I have access to a small localized dataset.', 'Radiology, Machine Learning', 'Diagnostics', 'PROTOTYPE', 'CO_FOUNDER', 'PART_TIME', 'MEDIUM', 'Istanbul', 'Turkey', 'ACTIVE'),
  ((SELECT id FROM users WHERE email='bot@healthai.dev'), 'Diabetes Risk Prediction', 'Need EHR integration insights! Creating an NLP-powered system to detect hidden diabetes risks in unstructured clinical notes.', 'NLP, Endocrinology', 'EHR Analytics', 'PROTOTYPE', 'CO_FOUNDER', 'PART_TIME', 'MEDIUM', 'Istanbul', 'Turkey', 'ACTIVE'),
  ((SELECT id FROM users WHERE email='bot@healthai.dev'), 'EHR Data Analysis Tool', 'A fast, privacy-preserving LLM agent capable of summarizing prolonged treatment records into quick dashboards.', 'Full-Stack, Prompt Engineering', 'Data Mining', 'IDEA', 'ADVISOR', 'FLEXIBLE', 'HIGH', 'Istanbul', 'Turkey', 'ACTIVE'),
  ((SELECT id FROM users WHERE email='bot@healthai.dev'), 'Wearable Device Integration for Arrhythmia', 'Seeking a team to build an anomaly detection microservice specifically pulling live data streams from Apple Watch. Needs strict latency optimizations.', 'Embedded Systems, Cardiology', 'Wearables & IoT', 'PROTOTYPE', 'CO_FOUNDER', 'PART_TIME', 'MEDIUM', 'Istanbul', 'Turkey', 'ACTIVE');
 