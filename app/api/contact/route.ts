import { sendContactEmail } from "@/lib/mail";
import { ContactFormSchema } from "@/lib/types";

/**
 * Handles contact form submissions.
 * Validates input, then delegates to the configured email provider.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ContactFormSchema.parse(body);

    const result = await sendContactEmail(validated);

    return Response.json({ success: true, id: result.id });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}