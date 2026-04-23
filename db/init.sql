DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS meeting_requests CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
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