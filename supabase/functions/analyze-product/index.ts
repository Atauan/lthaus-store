import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Define types
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

interface APIResponse {
  success: boolean;
  productData?: ProductData;
  error?: string;
  warning?: string;
}

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create CORS preflight response
function createCorsPreflightResponse() {
  return new Response("ok", { headers: corsHeaders });
}

// Create API response
function createApiResponse(data: APIResponse, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: status,
    }
  );
}

// Create error response
function createErrorResponse(error: string, status = 500) {
  return createApiResponse({ success: false, error }, status);
}

// Validate request body
function validateRequestBody(body: RequestBody): string | null {
  if (!body.image && !body.productName) {
    return "No image or product name provided";
  }
  return null;
}

// Main handler for the Edge Function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return createCorsPreflightResponse();
  }
  
  try {
    const supabaseClient = createSupabaseClient(req);
    
    // Get request body
    const body: RequestBody = await req.json();
    console.log("Request body:", JSON.stringify(body));
    
    // Validate the request body
    const validationError = validateRequestBody(body);
    if (validationError) {
      return createErrorResponse(validationError, 400);
    }
    
    // Check if DeepSeek API key is configured
    const deepseekApiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!deepseekApiKey) {
      console.log("DeepSeek API key is not configured, using fallback generator");
      // Use fallback generator for product info
      const productName = body.productName || "Unknown Product";
      const fallbackData = generateFallbackProductData(productName);
      
      return createApiResponse({
        success: true,
        productData: fallbackData,
        warning: "Using fallback data generation. No DeepSeek API key provided."
      });
    }
    
    // Process the request and analyze product
    return await processProductAnalysisRequest(body, deepseekApiKey);
  } catch (error) {
    console.error("Error processing request:", error);
    return createErrorResponse(error.message, 500);
  }
});

// Create Supabase client with authorization from request
function createSupabaseClient(req: Request) {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    }
  );
}

// Process the product analysis request
async function processProductAnalysisRequest(body: RequestBody, deepseekApiKey: string): Promise<Response> {
  try {
    let productData: ProductData;
    
    if (body.image) {
      console.log("Analyzing product image...");
      try {
        productData = await analyzeProductImage(body.image, deepseekApiKey);
      } catch (error) {
        console.error("Error analyzing image, using fallback:", error);
        const productName = "Unknown Product"; 
        productData = generateFallbackProductData(productName);
        return createApiResponse({
          success: true,
          productData,
          warning: "Image analysis failed. Using fallback data generation: " + error.message
        });
      }
    } else if (body.productName) {
      console.log("Analyzing product name:", body.productName);
      try {
        // First try to check if product already exists in database
        productData = await findExistingProduct(body.productName);
        
        if (productData) {
          console.log("Found existing product in database");
          return createApiResponse({
            success: true,
            productData,
            warning: "Used existing product data from database"
          });
        }
        
        // If not in database, try DeepSeek
        productData = await analyzeProductName(body.productName, deepseekApiKey);
      } catch (error) {
        console.error("Error analyzing product name:", error);
        
        // Use our fallback generator for simple product info
        const productName = body.productName || "Unknown Product";
        const fallbackData = generateFallbackProductData(productName);
        
        return createApiResponse({
          success: true,
          productData: fallbackData,
          warning: error.message.includes("Insufficient Balance") 
            ? "Used fallback data generation due to DeepSeek API credit limit. Consider recharging your DeepSeek account."
            : "Used fallback data generation: " + error.message
        });
      }
    } else {
      // This should never happen due to earlier validation
      return createErrorResponse("No image or product name provided", 400);
    }
    
    console.log("Analysis successful:", JSON.stringify(productData));
    return createApiResponse({
      success: true,
      productData,
    });
  } catch (error) {
    console.error("Error in analysis:", error);
    
    // Check if it's an insufficient balance error
    if (error.message && error.message.includes("Insufficient Balance")) {
      // Use our fallback generator for simple product info
      const productName = body.productName || "Unknown Product";
      const fallbackData = generateFallbackProductData(productName);
      
      return createApiResponse({
        success: true,
        productData: fallbackData,
        warning: "Used fallback data generation due to DeepSeek API credit limit. Consider recharging your DeepSeek account."
      });
    }
    
    return createErrorResponse(error.message || "Unknown error occurred", 500);
  }
}

// Try to find existing product in database based on name similarity
async function findExistingProduct(productName: string): Promise<ProductData | null> {
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Search for similar product names
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .textSearch('name', productName, { 
        type: 'plain',
        config: 'portuguese'
      });
      
    if (error) {
      console.error("Error searching products:", error);
      return null;
    }
    
    if (data && data.length > 0) {
      // Get the most relevant product (first result)
      const product = data[0];
      
      return {
        name: product.name,
        description: product.description || "",
        category: product.category,
        brand: product.brand,
        price: product.price,
        cost: product.cost || product.price * 0.6,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error finding existing product:", error);
    return null;
  }
}

// Generate fallback product data when AI API fails
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

// Analyze product image using DeepSeek Vision API
async function analyzeProductImage(
  base64Image: string,
  apiKey: string
): Promise<ProductData> {
  try {
    // Create the API request payload
    const payload = createDeepSeekVisionPayload(base64Image);
    
    // Call DeepSeek Vision API
    console.log("Sending request to DeepSeek for image analysis...");
    const response = await callDeepSeekAPI("https://api.deepseek.com/v1/chat/completions", apiKey, payload);
    
    // Process and return the response
    return parseDeepSeekResponse(response);
  } catch (error) {
    console.error("Error in analyzeProductImage:", error);
    throw error;
  }
}

// Create the payload for DeepSeek Vision API request
function createDeepSeekVisionPayload(base64Image: string) {
  return {
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
}

// Analyze product name using DeepSeek Chat API
async function analyzeProductName(
  productName: string,
  apiKey: string
): Promise<ProductData> {
  try {
    // Create the API request payload
    const payload = createDeepSeekChatPayload(productName);
    
    // Call DeepSeek Chat API
    console.log("Sending request to DeepSeek for product name analysis...");
    const response = await callDeepSeekAPI("https://api.deepseek.com/v1/chat/completions", apiKey, payload);
    
    // Process and return the response
    return parseDeepSeekResponse(response);
  } catch (error) {
    console.error("Error in analyzeProductName:", error);
    throw error;
  }
}

// Create the payload for DeepSeek Chat API request
function createDeepSeekChatPayload(productName: string) {
  return {
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
}

// Call DeepSeek API
async function callDeepSeekAPI(endpoint: string, apiKey: string, payload: any) {
  const response = await fetch(endpoint, {
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
  
  return await response.json();
}

// Parse DeepSeek API response
function parseDeepSeekResponse(data: any): ProductData {
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
}
