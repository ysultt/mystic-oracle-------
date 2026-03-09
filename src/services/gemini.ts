import OpenAI from 'openai';
// import {Readable} from "node:stream";
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || "",  // 从环境变量读取密钥
  baseURL: 'https://api.deepseek.com',         // DeepSeek 官方 API 地址
  dangerouslyAllowBrowser: true,                // 如果需要在浏览器端调用（不推荐），请确保理解安全风险
});




export const getTarotReading = async (cards: string[], question: string) => {
  // 构建 prompt
  const prompt = `我抽到了以下塔罗牌：${cards.join(', ')}。我的问题是：${question}。请作为一名资深的塔罗占卜师，为我提供深度的解析。请包含：每张牌的含义、它们之间的关联，以及对问题的最终建议。请使用 Markdown 格式。`;

  try {
    // 调用 DeepSeek 聊天补全接口
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',           // 或 'deepseek-reasoner'（推理模型）
      messages: [
        {
          role: 'system',
          content: '你是一位资深塔罗占卜师，精通各种牌阵和解读。请用 Markdown 格式回复，语言温暖而有洞察力。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,                  // 控制创造性，可根据需要调整
      max_tokens: 2000,                   // 控制回复长度
    });

    // 返回模型生成的文本内容
    return response.choices[0]?.message?.content || '暂无回复';
  } catch (error) {
    console.error('调用 DeepSeek API 失败:', error);
    throw new Error('塔罗解读服务暂时不可用');
  }
};

// export const getAstrologyReading = async (birthData: { date: string; time: string; location: string }, question: string) => {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: `我的出生信息是：日期 ${birthData.date}，时间 ${birthData.time}，地点 ${birthData.location}。我的问题是：${question}。请结合星盘知识（太阳、月亮、上升星座等）为我进行占星解析。请使用 Markdown 格式。`,
//   });
//   return response.text;
// };



export const getTarotReadingStream = async (cards: string[], question: string) => {
  const prompt = `我抽到了以下塔罗牌：${cards.join(', ')}。我的问题是：${question}。请作为一名资深的塔罗占卜师，为我提供深度的解析。请包含：每张牌的含义、它们之间的关联，以及对问题的最终建议。请使用 Markdown 格式。`;

  try {
    // 调用 DeepSeek 流式接口
    const stream = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一位资深塔罗占卜师，精通各种牌阵和解读。请用 Markdown 格式回复，语言温暖而有洞察力。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,               // 启用流式
    });

    // 创建一个 Node.js Readable 流，将 API 返回的数据块转换为字符串块
    const readableStream = "";
    // const readableStream = new Readable({
    //   async read() {
    //     for await (const chunk of stream) {
    //       // chunk 结构: { choices: [{ delta: { content: '...' } }] }
    //       const content = chunk.choices[0]?.delta?.content || '';
    //       if (content) {
    //         this.push(content);   // 将文本块推入流中
    //       }
    //     }
    //     this.push(null);           // 结束流
    //   }
    // });

    return readableStream;         // 返回流供调用方使用
  } catch (error) {
    console.error('调用 DeepSeek API 失败:', error);
    throw new Error('塔罗解读服务暂时不可用');
  }
};

export const getAstrologyReading = async (
    birthData: { date: string; time: string; location: string },
    question: string
) => {
  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat', // 使用 DeepSeek 的对话模型，也可以换成 'deepseek-reasoner' 等
    messages: [
      {
        role: 'user',
        content: `我的出生信息是：日期 ${birthData.date}，时间 ${birthData.time}，地点 ${birthData.location}。我的问题是：${question}。请结合星盘知识（太阳、月亮、上升星座等）为我进行占星解析。请使用 Markdown 格式。`,
      },
    ],
  });

  // DeepSeek 返回的内容位于 choices[0].message.content
  return response.choices[0].message.content;
};

// export const getDiceInterpretation = async (diceResult: number, question: string) => {
//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview",
//     contents: `我掷出了骰子，结果是 ${diceResult}（1-6）。我的问题是：${question}。请根据这个数字的象征意义和灵数学，给出一个简短而富有启发性的回答。请使用 Markdown 格式。`,
//   });
//   return response.text;
// };

export const getDiceInterpretation = async (diceResult: number, question: string) => {
  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat', // 使用 DeepSeek 对话模型
    messages: [
      {
        role: 'user',
        content: `我掷出了骰子，结果是 ${diceResult}（1-6）。我的问题是：${question}。请根据这个数字的象征意义和灵数学，给出一个简短而富有启发性的回答。请使用 Markdown 格式。`,
      },
    ],
  });

  return response.choices[0].message.content;
};
