// Simple test to verify JSON parsing fix
const testJSON = `Here's the JSON response you requested:

[
  {
    "id": 1,
    "title": "Test Story",
    "category": "Test"
  }
]

This is some additional text that should be ignored.`;

// Simulate the new parseJSONResponse function
function parseJSONResponse(jsonString) {
  console.log('=== JSON PARSING DEBUG ===');
  console.log('Input length:', jsonString.length);
  console.log('First 100 chars:', jsonString.substring(0, 100));
  
  // Clean the JSON string
  let cleaned = jsonString.trim();
  
  // Remove any LLaMA chat template tokens
  cleaned = cleaned
    .replace(/<\|start_header_id\|>/g, '')
    .replace(/<\|end_header_id\|>/g, '')
    .replace(/<\|[^>]*\|>/g, '')
    .trim();
  
  // Find JSON array boundaries
  const jsonStart = cleaned.indexOf('[');
  const jsonEnd = cleaned.lastIndexOf(']');
  
  if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
    console.warn('No valid JSON array found in response');
    throw new Error('No valid JSON array found in response');
  }
  
  // Extract only the JSON portion
  const jsonOnly = cleaned.substring(jsonStart, jsonEnd + 1);
  console.log('Extracted JSON length:', jsonOnly.length);
  
  try {
    const parsed = JSON.parse(jsonOnly);
    console.log('Successfully parsed JSON with', parsed.length, 'items');
    return parsed;
  } catch (parseError) {
    console.error('JSON parse error:', parseError.message);
    console.log('Failed JSON sample:', jsonOnly.substring(0, 200));
    
    // If parsing fails, use fallback data
    console.log('Using fallback data due to JSON parse error');
    throw new Error('JSON parsing failed - using fallback data');
  }
}

// Test the function
try {
  const result = parseJSONResponse(testJSON);
  console.log('SUCCESS: Parsed result:', result);
} catch (error) {
  console.log('ERROR:', error.message);
}
