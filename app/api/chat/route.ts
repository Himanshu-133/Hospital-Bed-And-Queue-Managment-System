import { NextResponse } from 'next/server';

// Fallback FAQ responses for when AI API is unavailable
const FAQ_RESPONSES: Record<string, string> = {
  queue: "Your current position in queue is shown on the Hospital Queue Management display. Average wait time is 25-40 minutes depending on your department.",
  appointment: "You can book appointments through the Appointments tab. Confirm your appointment to join the queue immediately. We have doctors available in Cardiology, Surgery, Neurology, Orthopedics, and General Medicine.",
  document: "Please bring your ID card, insurance details, and previous medical reports if available. These documents will help us provide better care.",
  emergency: "For emergencies, please contact the emergency desk directly or use our emergency ambulance service available 24/7.",
  hours: "Hospital operating hours are 9:00 AM - 9:00 PM daily. Our emergency services are available 24/7 for urgent cases.",
  payment: "We accept cash, card, and insurance. The payment desk is located on the ground floor. Please contact reception for payment plan options.",
  doctor: "Our hospital has experienced doctors in multiple departments. You can view available doctors and their schedules in the Doctors section of the admin panel.",
  medicine: "Medicines are available at our in-house pharmacy. Prescriptions from our doctors are processed immediately.",
  consultation: "Consultations are conducted by our qualified specialists. Average consultation time is 30-40 minutes including examination and initial treatment plan.",
  default: "I can help you with information about queue status, appointments, required documents, emergency services, hospital hours, payment options, and more. Please ask your question.",
};

function getFallbackResponse(userInput: string): string {
  const input = userInput.toLowerCase();

  if (input.includes('queue') || input.includes('position') || input.includes('wait') || input.includes('status')) {
    return FAQ_RESPONSES.queue;
  } else if (input.includes('appointment') || input.includes('book') || input.includes('schedule')) {
    return FAQ_RESPONSES.appointment;
  } else if (input.includes('document') || input.includes('bring') || input.includes('required')) {
    return FAQ_RESPONSES.document;
  } else if (input.includes('emergency') || input.includes('urgent') || input.includes('ambulance')) {
    return FAQ_RESPONSES.emergency;
  } else if (input.includes('hour') || input.includes('time') || input.includes('open') || input.includes('when')) {
    return FAQ_RESPONSES.hours;
  } else if (input.includes('payment') || input.includes('pay') || input.includes('cost') || input.includes('price')) {
    return FAQ_RESPONSES.payment;
  } else if (input.includes('doctor') || input.includes('specialist') || input.includes('physician')) {
    return FAQ_RESPONSES.doctor;
  } else if (input.includes('medicine') || input.includes('medicine') || input.includes('prescription')) {
    return FAQ_RESPONSES.medicine;
  } else if (input.includes('consultation') || input.includes('consult') || input.includes('checkup')) {
    return FAQ_RESPONSES.consultation;
  }
  return FAQ_RESPONSES.default;
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set');
    }

    // Convert messages to Groq API format
    const groqMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: typeof msg.content === 'string' ? msg.content : msg.parts?.[0]?.text || '',
    }));

    // Call Groq API directly
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are Himanshu, a helpful hospital assistant. You answer questions about:
- Queue status and wait times
- Appointment booking and confirmation
- Required documents for hospital visits
- Emergency services and ambulance availability
- Hospital operating hours (9 AM - 9 PM daily, 24/7 emergency)
- Payment options and procedures
- Doctor information and specialties
- Medicine and prescription services
- General consultation information

Be helpful, friendly, and concise. If you don't know something, suggest the user contact the hospital reception desk.`,
          },
          ...groqMessages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API error');
    }

    // Stream the response back to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }

                try {
                  const json = JSON.parse(data);
                  const delta = json.choices?.[0]?.delta?.content || '';
                  if (delta) {
                    const message = {
                      type: 'text-delta',
                      delta,
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            }
          }
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('[v0] AI API Error:', error?.message);
    
    // Fallback to rule-based responses when AI API fails
    const userMessage = messages[messages.length - 1];
    const userInput = userMessage?.content || '';
    const fallbackResponse = getFallbackResponse(userInput);

    // Return fallback response as a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send the fallback response as an SSE message
        const message = {
          type: 'text-delta',
          delta: fallbackResponse,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }
}
