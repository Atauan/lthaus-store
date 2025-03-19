
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  image?: string;
  productName?: string;
}

interface ProductData {
  name: string;
  description?: string;
  category: string;
  brand: string;
  price: number;
  cost?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    
    if (userError) {
      console.error("Auth error:", userError.message);
      throw new Error(`Error getting user: ${userError.message}`);
    }
    
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }
    
    // Get request body
    const body: RequestBody = await req.json();
    console.log("Request body:", JSON.stringify(body));
    
    // Check if we have the OpenAI API key
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "OpenAI API key is not configured",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    let productData: ProductData;
    
    if (body.image) {
      console.log("Analyzing product image...");
      // Analyze image using OpenAI's Vision API
      productData = await analyzeProductImage(body.image, openaiApiKey);
    } else if (body.productName) {
      console.log("Analyzing product name:", body.productName);
      // Analyze product name using OpenAI's Chat API
      productData = await analyzeProductName(body.productName, openaiApiKey);
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No image or product name provided",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    console.log("Analysis successful:", JSON.stringify(productData));
    return new Response(
      JSON.stringify({
        success: true,
        productData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function analyzeProductImage(
  base64Image: string,
  apiKey: string
): Promise<ProductData> {
  try {
    const payload = {
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this product image and provide the following information in JSON format: name, description, category (one of: Cabos, Capas, Áudio, Carregadores, Proteção, Acessórios), brand, and estimated retail price in BRL. Respond only with valid JSON."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    };
    
    console.log("Sending request to OpenAI for image analysis...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("OpenAI response:", content);
    
    // Extract JSON from the response
    let jsonMatch = content.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from the API response");
    }
    
    try {
      // Parse the JSON
      const productInfo = JSON.parse(jsonMatch[0]);
      
      // Validate and format the response
      return {
        name: productInfo.name || "Produto Desconhecido",
        description: productInfo.description || "",
        category: productInfo.category || "Acessórios",
        brand: productInfo.brand || "Generic",
        price: parseFloat(productInfo.price) || 0,
        cost: parseFloat(productInfo.price) * 0.6 || 0, // Estimate cost as 60% of retail price
      };
    } catch (error) {
      throw new Error(`Error parsing JSON response: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in analyzeProductImage:", error);
    throw error;
  }
}

async function analyzeProductName(
  productName: string,
  apiKey: string
): Promise<ProductData> {
  try {
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Analyze this product name: "${productName}" and provide the following information in JSON format: 
          full product name, description, category (one of: Cabos, Capas, Áudio, Carregadores, Proteção, Acessórios), brand, and estimated retail price in BRL. 
          Respond only with valid JSON.`
        }
      ],
      max_tokens: 500
    };
    
    console.log("Sending request to OpenAI for product name analysis...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("OpenAI response:", content);
    
    // Extract JSON from the response
    let jsonMatch = content.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from the API response");
    }
    
    try {
      // Parse the JSON
      const productInfo = JSON.parse(jsonMatch[0]);
      
      // Validate and format the response
      return {
        name: productInfo.name || productName,
        description: productInfo.description || "",
        category: productInfo.category || "Acessórios",
        brand: productInfo.brand || "Generic",
        price: parseFloat(productInfo.price) || 0,
        cost: parseFloat(productInfo.price) * 0.6 || 0, // Estimate cost as 60% of retail price
      };
    } catch (error) {
      throw new Error(`Error parsing JSON response: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in analyzeProductName:", error);
    throw error;
  }
}
