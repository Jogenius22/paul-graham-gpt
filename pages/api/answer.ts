import { OpenAIStream } from "@/utils";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { prompt, query, apiKey } = (await req.json()) as {
      prompt: string;
      query: string;
      apiKey: string;
    };

    const stream = await OpenAIStream(prompt, query, apiKey);

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
