
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
    
    // Get request body
    const body: RequestBody = await req.json();
    console.log("Request body:", JSON.stringify(body));
    
    // Check if we have the DeepSeek API key
    const deepseekApiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!deepseekApiKey) {
      console.error("DeepSeek API key is not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "DeepSeek API key is not configured",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    let productData: ProductData;
    
    try {
      if (body.image) {
        console.log("Analyzing product image...");
        // Analyze image using DeepSeek's Vision API
        productData = await analyzeProductImage(body.image, deepseekApiKey);
      } else if (body.productName) {
        console.log("Analyzing product name:", body.productName);
        // Analyze product name using DeepSeek's Chat API
        productData = await analyzeProductName(body.productName, deepseekApiKey);
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
      console.error("Error in analysis:", error);
      
      // Check if it's an insufficient balance error
      if (error.message && error.message.includes("Insufficient Balance")) {
        // Use our fallback generator for simple product info
        const productName = body.productName || "Unknown Product";
        const fallbackData = generateFallbackProductData(productName);
        
        return new Response(
          JSON.stringify({
            success: true,
            productData: fallbackData,
            warning: "Used fallback data generation due to DeepSeek API credit limit. Consider recharging your DeepSeek account."
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "Unknown error occurred",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
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

// Fallback data generation function when AI API fails
function generateFallbackProductData(productName: string): ProductData {
  // Extract potential category and brand from the product name
  const lowerName = productName.toLowerCase();
  
  // Try to determine category
  let category = "Acessórios";
  if (lowerName.includes("cabo") || lowerName.includes("carregador") || lowerName.includes("usb")) {
    category = "Cabos";
  } else if (lowerName.includes("capa") || lowerName.includes("case") || lowerName.includes("protetor")) {
    category = "Capas";
  } else if (lowerName.includes("fone") || lowerName.includes("áudio") || lowerName.includes("audio")) {
    category = "Áudio";
  } else if (lowerName.includes("carregador") || lowerName.includes("fonte") || lowerName.includes("adaptador")) {
    category = "Carregadores";
  } else if (lowerName.includes("película") || lowerName.includes("pelicula") || lowerName.includes("proteção")) {
    category = "Proteção";
  }
  
  // Try to extract brand
  let brand = "Generic";
  const commonBrands = ["apple", "samsung", "xiaomi", "motorola", "jbl", "huawei", "anker", "baseus"];
  for (const brandName of commonBrands) {
    if (lowerName.includes(brandName)) {
      brand = brandName.charAt(0).toUpperCase() + brandName.slice(1);
      break;
    }
  }
  
  // Generate baseline price based on category
  let basePrice = 39.90;
  if (category === "Capas") basePrice = 29.90;
  if (category === "Proteção") basePrice = 19.90;
  if (category === "Carregadores") basePrice = 59.90;
  if (category === "Áudio") basePrice = 79.90;
  
  // Add premium if it's a known brand
  if (brand !== "Generic") {
    basePrice *= 1.5;
  }
  
  // Round to 2 decimal places
  basePrice = Math.round(basePrice * 100) / 100;
  
  return {
    name: productName,
    description: `${productName} - ${category} para smartphones e dispositivos eletrônicos.`,
    category: category,
    brand: brand,
    price: basePrice,
    cost: basePrice * 0.6,
  };
}

async function analyzeProductImage(
  base64Image: string,
  apiKey: string
): Promise<ProductData> {
  try {
    const payload = {
      model: "deepseek-vision",
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
    
    console.log("Sending request to DeepSeek for image analysis...");
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API Error:", errorData);
      throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("DeepSeek response:", content);
    
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
      model: "deepseek-chat",
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
    
    console.log("Sending request to DeepSeek for product name analysis...");
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API Error:", errorData);
      throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    console.log("DeepSeek response:", content);
    
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
