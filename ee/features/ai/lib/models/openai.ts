import { OpenAI } from "openai";

// Lazily construct the OpenAI client. Constructing it at module load throws
// when OPENAI_API_KEY is unset, which breaks anything that imports this module
// (e.g. the Trigger.dev worker indexing all task files at startup). The Proxy
// defers construction until the client is actually used, so importing this
// module is always safe even without AI configured.
let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _client;
}

export const openai = new Proxy({} as OpenAI, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as OpenAI;
