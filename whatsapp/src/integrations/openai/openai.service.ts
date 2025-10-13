import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import openAi from "./index";

export const getOpenAiResponse = async (
  text: string,
  {
    context,
  }: {
    context?: string[];
  } = {}
): Promise<string | undefined | null> => {
  if (!openAi) {
    return;
  }

  const contextMessages: ChatCompletionMessageParam[] =
    context?.map((message) => ({
      role: "system",
      content: message,
    })) ?? [];

  const stream = await openAi.chat.completions.stream({
    model: "gpt-4",
    messages: [
      ...contextMessages,
      {
        role: "user",
        content: text,
      },
    ],
    stream: true,
  });

  const chatCompletion = await stream.finalChatCompletion();
  return chatCompletion.choices[0]?.message.content;
};
