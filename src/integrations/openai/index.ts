import OpenAI from "openai";

let openAi: OpenAI | undefined;

if (openAi === undefined) {
  openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export default openAi;
