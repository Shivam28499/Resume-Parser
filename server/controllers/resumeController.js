import { askAI } from "../services/aiService.js";
import { ResumeSchema } from "../utils/resumeSchema.js";

const SYSTEM_PROMPT = `you are expert resume parser. Your task is to extract structured data from raw resume text into strict JSON schema.`;
const FEW_SHOT_EXAMPLES = `### Example 1 — Academic/CV style

INPUT:
[YOU WRITE — fake unstructured resume text, 8-12 lines, academic/CV style with sections like EDUCATION, EXPERIENCE, SKILLS]

Resume :
Sachin Kumar
sachin@gmail.com,linkedin,9898000298
skills:react.js,node.js,python,javascript
experience
amazon software engineer  december 2025-present.
-build automation tools for banking process.
-build frontend responsive design used 100K persons.

project
---Riding App---
- update live location of the rider.
- used google map key.

education
B-Tech
AAAA college 2022-2026 
CGPA - 8.0

OUTPUT:
{
  "name": "Sachin Kumar",
  "email": "sachin@gmail.com",
  "skills": ["react.js", "node.js", "python", "javascript"],
  "experience": [
    {
      "role": "Software Engineer",
      "company": "Amazon",
      "duration": "December 2025 - Present",
      "highlights": [
        "Built automation tools for banking process",
        "Built frontend responsive design used by 100K persons"
      ]
    }
  ]
}

### Example 2 — Modern bulleted format

INPUT:
PRIYA SHARMA
priya.sharma.dev@gmail.com  •  +91 8765432109  •  github.com/priyasharma

EXPERIENCE
• Backend Developer @ Flipkart (Aug 2023 - Present)
  • Designed REST APIs handling 50K req/sec on Django + Postgres
  • Migrated legacy monolith to microservices, reduced latency 40%
  • Led on-call rotation, cut p95 latency from 800ms to 220ms

EDUCATION
• B.Tech CSE, IIT Bombay (2019-2023), CGPA 9.1

SKILLS
• Languages: Python, Go, SQL
• Frameworks: Django, FastAPI, Celery
• Infra: AWS (EC2, RDS, Lambda), Docker, Kubernetes

OUTPUT:
{
  "name": "Priya Sharma",
  "email": "priya.sharma.dev@gmail.com",
  "skills": ["Python", "Go", "SQL", "Django", "FastAPI", "Celery", "AWS", "Docker", "Kubernetes"],
  "experience": [
    {
      "role": "Backend Developer",
      "company": "Flipkart",
      "duration": "Aug 2023 - Present",
      "highlights": [
        "Designed REST APIs handling 50K req/sec on Django + Postgres",
        "Migrated legacy monolith to microservices, reduced latency 40%",
        "Led on-call rotation, cut p95 latency from 800ms to 220ms"
      ]
    }
  ]
}

### Example 3 — Paragraph narrative

INPUT:

Shivam Kumar
shivamkumar0008@gmail.com •+91 8888339448  github: github.com/shiv

EXPERIENCE
• Software Developer @BetterOG (oct 2025 - may 2026)
  build LLM tools used by 10k peoples.
  build 10+ tables define relationships.


EDUCATION
•B-Tech
AB College (2020-2026)
CGPA - 7.5

SKILLS: Python,MYSQL,LLM,Machine Learning,AI Agents



OUTPUT:

{
    "name":"Shivam Kumar",
    "email":"shivamkumar0008@gmail.com",
    "skills":["python","MYSQL","LLM","Machine Learning","AI Agents"],
    "experience":[
        {
            "role":"Software developer",
            "company":"BetterOG",
            "duration":"oct 2025 - may 2026",
            "highlights":[
                "build LLM tools used by 10k peoples",
                "build 10+ tables define relationships"
            ]
        }
    ]
}

---

Now extract from this resume:

{{resumeText}}
`;

export const parseResume = async (req, res) => {
    try {
        const {resumeText} = req.body;

        if(!resumeText || !resumeText.trim()) {
            return res.status(400).json({message: "resumeText is required"});
        }

        const userPrompt = `${FEW_SHOT_EXAMPLES}\n\nNow extract from ths resume:\n\n${resumeText}`;
        const raw = await askAI(userPrompt, SYSTEM_PROMPT, "{");

        let parsed;

        try {
            parsed = JSON.parse(raw);
        } catch (error) {
            return res.status(500).json({
                message: "LLM returned invalid JSON",
                raw
            });
        }

        const result = ResumeSchema.safeParse(parsed);
        if(!result.success){
            return res.status(500).json({
                message: "Validation failed",
                errors: result.error.flatten()
            });
        }

        res.json({resume: result.data});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}