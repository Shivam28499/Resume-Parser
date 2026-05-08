import Groq from "groq-sdk";
import dotenv from 'dotenv';
dotenv.config();

const groq  = new Groq({apiKey:process.env.Groq_API_KEY});
export const askAI = async (prompt, systemPrompt, prefill='') =>{
    let messages = [
        {role: 'system',content: systemPrompt},
        {role:'user',content: prompt},
    ];

    if(prefill) {
        messages.push({role:'assistant', content: prefill});
    }

    const result =  await groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 2048
    });

    return prefill + result.choices[0].message.content;

}
