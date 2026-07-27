import OpenAI from "openai"
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
  const model = process.env.MODEL || "gpt-4o"
  if (!apiKey) throw new Error("OPENAI_API_KEY environment variable is not set")
  const client = new OpenAI({ apiKey, baseURL })
  return { client, model }
}
export async function streamAI(messages: Array<{role:"system"|"user"|"assistant";content:string}>, onChunk: (text:string)=>void) {
  const {client,model}=getOpenAI()
  const stream=await client.chat.completions.create({model,messages,stream:true,temperature:0.7,max_tokens:4096})
  let full=""
  for await(const chunk of stream){const delta=chunk.choices[0]?.delta?.content||"";if(delta){full+=delta;onChunk(delta)}}
  return full
}
export async function askAI(messages:Array<{role:"system"|"user"|"assistant";content:string}>):Promise<string> {
  const{client,model}=getOpenAI()
  const r=await client.chat.completions.create({model,messages,temperature:0.7,max_tokens:4096})
  return r.choices[0]?.message?.content||""
}
export async function structuredAI<T>(messages:Array<{role:"system"|"user"|"assistant";content:string}>):Promise<T> {
  const{client,model}=getOpenAI()
  const r=await client.chat.completions.create({model,messages:[...messages,{role:"system",content:"Respond with valid JSON only."}],temperature:0.3,max_tokens:4096,response_format:{type:"json_object"}})
  return JSON.parse(r.choices[0]?.message?.content||"{}") as T
}
export async function getEmbedding(text:string):Promise<number[]> {
  const{client}=getOpenAI()
  const m=process.env.EMBEDDING_MODEL||"text-embedding-3-large"
  const r=await client.embeddings.create({model:m,input:text})
  return r.data[0].embedding
}
