import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });


export const getTarotReading = async (cards: string[], question: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `我抽到了以下塔罗牌：${cards.join(", ")}。我的问题是：${question}。请作为一名资深的塔罗占卜师，为我提供深度的解析。请包含：每张牌的含义、它们之间的关联，以及对问题的最终建议。请使用 Markdown 格式。`,
  });
  return response.text;
};

export const getAstrologyReading = async (birthData: { date: string; time: string; location: string }, question: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `我的出生信息是：日期 ${birthData.date}，时间 ${birthData.time}，地点 ${birthData.location}。我的问题是：${question}。请结合星盘知识（太阳、月亮、上升星座等）为我进行占星解析。请使用 Markdown 格式。`,
  });
  return response.text;
};

export const getDiceInterpretation = async (diceResult: number, question: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `我掷出了骰子，结果是 ${diceResult}（1-6）。我的问题是：${question}。请根据这个数字的象征意义和灵数学，给出一个简短而富有启发性的回答。请使用 Markdown 格式。`,
  });
  return response.text;
};
