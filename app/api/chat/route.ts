import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, results, type, data } = await req.json();

    let systemPrompt = "";
    let finalPrompt = prompt;

    if (type === "org_admin") {
      systemPrompt = `Your role is to generate actionable, business-focused carbon reduction recommendations for organization admins.

Do NOT output generic sustainability advice.

Focus on:
- measurable impact
- specific actions
- organizational context
- prioritization

Always structure output into:
1. Key Recommendations (top 3–5)
2. Impact (CO2 reduction estimate)
3. Priority Level (High/Medium/Low)
4. Department/Scope affected
5. Reason (data-driven explanation)

Tone:
- concise
- executive-friendly
- decision-oriented

Avoid:
- generic advice like "use less electricity"
- long explanations without action`;

      finalPrompt = `Here is our current organization data:
Total Users: ${data?.totalUsers}
Total CO2 emitted this month: ${data?.totalCo2} kg
Average Risk Score: ${data?.avgRisk}%
High Risk Users: ${data?.highRiskUsers}
Top States of Operation: ${data?.topStates}

Please provide the strategic recommendations.`;
    } else if (type === "village_expert") {
      systemPrompt = `You are Vayundhra, an expert AI sustainability advisor specializing in Village-level Carbon Indexing. 
You are currently in the "Village Hub" answering a query. You must only answer questions related to the 6 pillars of village emissions:
1. Crops (Type, Area, Stubble burning)
2. Water Quality (Pollution, CH4 from stagnant water)
3. Electricity (Grid usage)
4. Transport (Tractors, Commercial vehicles)
5. Households (Families)
6. Waste (Open dump sites, Composting %)

Provide practical, customized recommendations based on the user's specific input values. Do not use emojis. Keep it concise.
If they ask about something outside these 6 categories, politely redirect them to focus on village infrastructure.`;

      finalPrompt = `Here is the current village data:
- Crops: ${data?.crops?.type}, ${data?.crops?.area} acres, ${data?.crops?.stubble}% stubble burning
- Water Quality: ${data?.water?.pollution} pollution, ${data?.water?.ch4} tonnes/yr CH4
- Electricity: ${data?.electricity?.usage} kWh/month
- Transport: ${data?.transport?.tractors} tractors, ${data?.transport?.commercial} commercial vehicles
- Households: ${data?.households?.families} families
- Waste: ${data?.waste?.dumpSites} open dump sites, ${data?.waste?.composting}% composting
- Calculated Per Capita Footprint: ${data?.perCapita?.toFixed(2)} tonnes CO2e/year

User Query: ${prompt}`;
    } else {
      systemPrompt = `You are Vayundhra, an expert AI sustainability advisor. The user has a total CO2 footprint of ${results?.total || 0} kg/month. Their breakdown is: Electricity: ${results?.electricity || 0} kg, Transport: ${results?.transport || 0} kg, LPG: ${results?.lpg || 0} kg. Answer their question specifically using these numbers. Do not use emojis. Provide your response as crisp, concise, point-wise bullet points. Do not write long paragraphs. You also have access to live satellite data feeds. When relevant, you can say: "Based on live satellite data from 10 minutes ago, I can see that the methane plume in [City] has increased." (replace [City] with the relevant location).`;
    }

    if (type === "org_admin") {
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalPrompt }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        max_tokens: 600,
        stream: true,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        }
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } else {
      const chat = await client.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalPrompt }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        max_tokens: 600,
      });
      return NextResponse.json({ content: chat.choices[0].message.content });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
