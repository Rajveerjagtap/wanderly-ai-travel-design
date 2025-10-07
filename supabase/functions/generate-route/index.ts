import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startLocation, destination } = await req.json();
    console.log("Generating route from", startLocation, "to", destination);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Call Lovable AI using tool calling to get structured output
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert travel planner specializing in Indian destinations. Generate detailed travel routes with realistic information about transportation, attractions, restaurants, and accommodations across India. Include accurate cost estimates in Indian Rupees (₹), timing, and recommendations for the best time to visit considering Indian seasons and weather.`
          },
          {
            role: "user",
            content: `Create a detailed travel route from ${startLocation} to ${destination}. Include 4-6 stops with transportation, attractions, and dining options. For each stop, provide:
- Mode of transport (train, flight, bus, car, etc.) - use common Indian transport options
- Estimated time
- Estimated cost in Indian Rupees (₹)
- Popularity rating (1-5)
- Best time to visit (month/season) - consider Indian weather patterns
- Brief description with local context`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_route",
              description: "Generate a complete travel route with stops",
              parameters: {
                type: "object",
                properties: {
                  stops: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["transport", "attraction", "restaurant", "accommodation"],
                          description: "Type of stop"
                        },
                        title: {
                          type: "string",
                          description: "Name of the place or activity"
                        },
                        time: {
                          type: "string",
                          description: "Estimated duration (e.g., '2h 30min', '1h')"
                        },
                        cost: {
                          type: "string",
                          description: "Estimated cost in Indian Rupees (e.g., '₹500', '₹1000-1500')"
                        },
                        description: {
                          type: "string",
                          description: "Brief description of the stop"
                        },
                        popularity: {
                          type: "number",
                          description: "Popularity rating from 1-5",
                          minimum: 1,
                          maximum: 5
                        },
                        bestTimeToVisit: {
                          type: "string",
                          description: "Best time to visit (e.g., 'Spring', 'June-August', 'Year-round')"
                        }
                      },
                      required: ["type", "title", "time", "cost", "description", "popularity", "bestTimeToVisit"]
                    }
                  },
                  totalDuration: {
                    type: "string",
                    description: "Total trip duration (e.g., '3 days', '1 week')"
                  },
                  totalCost: {
                    type: "string",
                    description: "Estimated total cost range in Indian Rupees (e.g., '₹5000-7000')"
                  },
                  overallBestTime: {
                    type: "string",
                    description: "Best overall time to take this trip"
                  }
                },
                required: ["stops", "totalDuration", "totalCost", "overallBestTime"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_route" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to generate route");
    }

    const data = await response.json();
    console.log("AI Response:", JSON.stringify(data, null, 2));
    
    // Extract the function call result
    const toolCall = data.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No route data generated");
    }

    const routeData = JSON.parse(toolCall.function.arguments);
    console.log("Generated route:", routeData);

    return new Response(
      JSON.stringify(routeData),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error in generate-route function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
