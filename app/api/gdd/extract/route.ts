import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { extractTextFromBuffer, extractProjectFromText } from "@/agent/extractor";

export async function POST(request: Request) {
  try {
    // 1. Authenticate session
    const insforge = await createInsforgeServer();
    const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized user session" }, { status: 401 });
    }

    // 2. Parse request payload
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const url = formData.get("url")?.toString();

    let buffer: Buffer;
    let mimeType: string;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      mimeType = file.type || "text/plain";
    } else if (url) {
      // Since the bucket has authenticated-access only, standard fetch returns Unauthorized.
      // Use the authenticated insforge.storage client instead.
      const bucketName = "drafts";
      const marker = "/objects/";
      const markerIndex = url.indexOf(marker);
      if (markerIndex === -1) {
        return NextResponse.json({ error: "Invalid InsForge Storage URL format" }, { status: 400 });
      }
      // Extract the url-encoded key and decode it
      const key = decodeURIComponent(url.substring(markerIndex + marker.length));

      const { data: blob, error: downloadError } = await insforge.storage
        .from(bucketName)
        .download(key);

      if (downloadError || !blob) {
        console.error("[API/GDD/Extract] InsForge Storage download error:", downloadError);
        return NextResponse.json({ 
          error: `Failed to download file from InsForge storage: ${downloadError?.message || "File empty or missing"}` 
        }, { status: 400 });
      }

      const arrayBuffer = await blob.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      
      // Determine mimetype
      mimeType = blob.type || "";
      if (!mimeType || mimeType === "application/octet-stream") {
        if (url.toLowerCase().endsWith(".pdf")) {
          mimeType = "application/pdf";
        } else {
          mimeType = "text/plain";
        }
      }
    } else {
      return NextResponse.json({ error: "No file or URL provided for extraction" }, { status: 400 });
    }

    // 3. Extract text content
    const text = await extractTextFromBuffer(buffer, mimeType);
    if (!text || text.trim().length < 50) {
      return NextResponse.json({ 
        error: "Insufficient document text character length. The parsed draft must contain at least 50 characters." 
      }, { status: 400 });
    }

    // 4. Send to Gemini for GDD layout mapping
    const projectData = await extractProjectFromText(text);

    return NextResponse.json({ success: true, data: projectData });
  } catch (error: any) {
    console.error("[API/GDD/Extract] Unexpected error:", error);
    return NextResponse.json({ 
      error: error.message || "An unexpected error occurred during AI GDD extraction" 
    }, { status: 500 });
  }
}
