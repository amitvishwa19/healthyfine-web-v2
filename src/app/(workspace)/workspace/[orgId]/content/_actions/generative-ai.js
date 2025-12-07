'use server'
import { z } from "zod";
import { createSafeAction } from "@/utils/CreateSafeAction";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid'
import { ROLE } from "@prisma/client";

const GenerativeAI = z.object({
    orgId: z.string(),
    userId: z.string(),
    topic: z.string(),
    platform: z.string(),
    tone: z.string(),
    contentType: z.string(),
    image: z.boolean()
});





const handler = async (data) => {
    let content
    let imagePrompt
    let imageDescription
    let imageUrl = null


    try {



    } catch (error) {
        return { message: "Oops!, something went wrong", error }
    }

    return { data: { content, imagePrompt: imageDescription, imageUrl } };

}


export const generativeAI = createSafeAction(GenerativeAI, handler);