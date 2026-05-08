import {z} from 'zod';

export const ResumeSchema = z.object({
    name: z.string(),
    email: z.string().email().optional(),
    skills: z.array(z.string()),
    experience: z.array(
        z.object({
            role: z.string(),
            company: z.string(),
            duration: z.string(),
            highlights: z.array(z.string()),
        })
    ),
});