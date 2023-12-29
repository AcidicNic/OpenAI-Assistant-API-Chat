/**
 * API Route - List Messages in a Thread
 *
 * This API route is responsible for retrieving messages from a specific chat thread using the OpenAI API.
 * It processes POST requests that include a 'threadId' in the form data. The route fetches the messages
 * associated with the provided thread ID and returns them in a structured JSON format. It's designed to
 * facilitate the tracking and review of conversation threads created and managed via OpenAI's GPT models.
 *
 * Path: /api/retrieveAssistant
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

// Initialize OpenAI client using the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define an asynchronous POST function to handle incoming requests
export async function POST(req: NextRequest) {
  try {
    // Extract JSON data from the request
    const data = await req.json();

    // Retrieve 'assistantId' from JSON data
    const assistantId = data.assistantId;

    // Log the received thread ID for debugging
    console.log(`Received request with assistantId: ${assistantId}`);

    // Retrieve messages for the given thread ID using the OpenAI API
    const assistant = await openai.beta.assistants.retrieve(assistantId);

    // Return the retrieved messages as a JSON response
    return NextResponse.json({
      ok: true,
      assistant: {
        id: assistant.id, name: assistant.name, description: assistant.description
      }
    });
  } catch (error) {
    // Log any errors that occur during the process
    return NextResponse.json({
      ok: false,
      assistant: null
    });
  }
}