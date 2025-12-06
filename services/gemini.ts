import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getDailyHoroscope = async (sign: string, lang: Language): Promise<string> => {
  if (!apiKey) return lang === 'en' ? "API Key missing. Please configure the environment." : "API కీ లేదు.";
  
  const languagePrompt = lang === 'te' ? 'Telugu' : 'English';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a daily horoscope for the zodiac sign ${sign} in ${languagePrompt} language. 
      Focus on career, health, and spiritual growth. 
      Keep it positive, mystical, and concise (under 80 words).`,
    });
    return response.text || (lang === 'en' ? "The stars are aligned mysteriously today." : "ఈ రోజు నక్షత్రాలు అనుకూలంగా ఉన్నాయి.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'en' ? "Unable to fetch celestial data at this moment." : "ప్రస్తుతం ఫలితాలు అందుబాటులో లేవు.";
  }
};

export const getKundaliAnalysis = async (name: string, dob: string, time: string, place: string, lang: Language): Promise<string> => {
  if (!apiKey) return lang === 'en' ? "API Key missing." : "API కీ లేదు.";

  const languagePrompt = lang === 'te' ? 'Telugu' : 'English';

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as an expert Vedic Astrologer. Create a brief birth chart analysis (Kundali) for:
      Name: ${name}
      DOB: ${dob}
      Time: ${time}
      Place: ${place}
      
      Provide 3 key insights in ${languagePrompt} language:
      1. Personality Trait (based on Moon sign)
      2. Career path suggestion
      3. A generic lucky gem or color.
      
      Keep the tone respectful, traditional, and uplifting. Output in markdown.`,
    });
    return response.text || (lang === 'en' ? "Chart analysis unavailable." : "జాతక విశ్లేషణ అందుబాటులో లేదు.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'en' ? "The stars are cloudy. Please try again later." : "దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి.";
  }
};