const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: "postgres://postgres:password@localhost:5432/person_db",
});

async function seed() {
  console.log("Starting DB seeding...");

  try {
    // Check if mock user exists
    let userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1", ["bot@healthai.dev"]
    );
    let userId;

    if (userResult.rows.length === 0) {
      const passwordHash = await bcrypt.hash("password123", 10);
      const userInsert = await pool.query(
        `INSERT INTO users (full_name, email, password_hash, role, institution, status, email_verified)
         VALUES ($1, $2, $3, $4, $5, 'ACTIVE', true) RETURNING id`,
        ["HealthAI System Bot", "bot@healthai.dev", passwordHash, "ENGINEER", "HealthAI Lab"]
      );
      userId = userInsert.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    console.log("Using Mock User ID:", userId);

    const posts = [
      {
        title: "AI Lung Cancer Detection",
        description: "Looking for an expert radiologist to collaborate tightly on refining a ResNet model for identifying early-stage lung nodules. I have access to a small localized dataset.",
        expertise: "Radiology, Machine Learning",
        domain: "Diagnostics",
      },
      {
        title: "Diabetes Risk Prediction",
        description: "Need EHR integration insights! Creating an NLP-powered system to detect hidden diabetes risks in unstructured clinical notes.",
        expertise: "NLP, Endocrinology",
        domain: "EHR Analytics",
      },
      {
        title: "EHR Data Analysis Tool",
        description: "A fast, privacy-preserving LLM agent capable of summarizing prolonged treatment records into quick dashboards.",
        expertise: "Full-Stack, Prompt Engineering",
        domain: "Data Mining",
      },
      {
        title: "Wearable Device Integration for Arrhythmia",
        description: "Seeking a team to build an anomaly detection microservice specifically pulling live data streams from Apple Watch. Needs strict latency optimizations.",
        expertise: "Embedded Systems, Cardiology",
        domain: "Wearables & IoT",
      }
    ];

    for (const post of posts) {
      await pool.query(
        `INSERT INTO posts
        (author_id, title, description, needed_expertise, working_domain, project_stage,
         collaboration_type, commitment_level, confidentiality_level, city, country, status)
        VALUES ($1, $2, $3, $4, $5, 'PROTOTYPE', 'CO_FOUNDER', 'PART_TIME', 'MEDIUM', 'Istanbul', 'Turkey', 'ACTIVE')`,
        [userId, post.title, post.description, post.expertise, post.domain]
      );
    }
    console.log("Successfully seeded mock posts into DB!");
  } catch (err) {
    console.error("Seeding Error:", err);
  } finally {
    pool.end();
  }
}

seed();
