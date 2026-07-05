"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";
import { GDDData } from "@/types";

export type SaveProjectResult = {
  success: boolean;
  id?: string;
  error?: string;
};

export async function saveProjectAction(
  projectId: string | null,
  formData: FormData
): Promise<SaveProjectResult> {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user }, error: authError } = await insforge.auth.getCurrentUser();

    if (authError || !user) {
      return { success: false, error: "Unauthorized user session" };
    }

    const title = formData.get("title")?.toString() || "";
    const genre = formData.get("genre")?.toString() || "";
    const artStyle = formData.get("artStyle")?.toString() || "";
    const targetAudience = formData.get("targetAudience")?.toString() || "";
    
    // Parse platform from comma-separated string format in FormData
    const platform = formData.get("platform")?.toString() || "";
    
    // Parse keywords
    const keywordsRaw = formData.get("keywords")?.toString();
    const keywords: string[] = keywordsRaw ? JSON.parse(keywordsRaw) : [];

    // GDD Data
    const playerLoop = formData.get("playerLoop")?.toString() || "";
    const monetizationStrategy = formData.get("monetization")?.toString() || "";
    const coreMechanicsRaw = formData.get("coreMechanics")?.toString();
    const coreMechanics: string[] = coreMechanicsRaw ? JSON.parse(coreMechanicsRaw) : [];

    const gdd_data: GDDData = {
      playerLoop,
      coreMechanics,
      monetizationStrategy,
    };

    // Calculate completeness: title, genre, and playerLoop must be present
    const is_complete = !!(title.trim() && genre.trim() && playerLoop.trim());

    let finalProjectId = projectId;
    const isNew = !projectId || projectId === "1" || projectId === "new";

    // 1. Database Upsert
    if (isNew) {
      // Insert new project
      const { data, error: dbError } = await insforge.database
        .from("projects")
        .insert([{
          user_id: user.id,
          title,
          genre,
          art_style: artStyle,
          platform,
          target_audience: targetAudience,
          keywords,
          gdd_data,
          is_complete,
          pitch_deck_url: null,
        }])
        .select()
        .single();

      if (dbError || !data) {
        console.error("[actions/projects] DB Insert Error:", dbError);
        return { success: false, error: dbError?.message || "Failed to create project record" };
      }
      finalProjectId = data.id;
    } else {
      // Update existing project
      const { error: dbError } = await insforge.database
        .from("projects")
        .update({
          title,
          genre,
          art_style: artStyle,
          platform,
          target_audience: targetAudience,
          keywords,
          gdd_data,
          is_complete,
        })
        .eq("id", projectId)
        .eq("user_id", user.id);

      if (dbError) {
        console.error("[actions/projects] DB Update Error:", dbError);
        return { success: false, error: dbError.message || "Failed to update project record" };
      }
    }

    // 2. Optional File Upload
    const file = formData.get("file") as File | null;
    if (file && file.size > 0 && finalProjectId) {
      const { error: uploadError } = await insforge.storage
        .from("drafts")
        .upload(`drafts/${user.id}/${finalProjectId}/gdd.pdf`, file);

      if (uploadError) {
        console.error("[actions/projects] File Upload Error:", uploadError);
        // Do not fail the whole save, just log and continue, or we can choose to report it
      } else {
        // Get public URL
        const { data: urlData } = insforge.storage
          .from("drafts")
          .getPublicUrl(`drafts/${user.id}/${finalProjectId}/gdd.pdf`);

        if (urlData?.publicUrl) {
          // Update project record with the URL
          const { error: updateUrlError } = await insforge.database
            .from("projects")
            .update({ pitch_deck_url: urlData.publicUrl })
            .eq("id", finalProjectId)
            .eq("user_id", user.id);

          if (updateUrlError) {
            console.error("[actions/projects] URL Update Error:", updateUrlError);
          }
        }
      }
    }

    // Revalidate paths to sync layouts
    revalidatePath("/projects");
    revalidatePath("/dashboard");
    if (finalProjectId) {
      revalidatePath(`/projects/${finalProjectId}`);
    }

    return { success: true, id: finalProjectId || undefined };
  } catch (error) {
    console.error("[actions/projects] Unexpected Error:", error);
    return { success: false, error: "An unexpected server error occurred while saving" };
  }
}
