interface GeminiResponse {
  error?: {
    message: string;
  };
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  
  try {
    const response = await $fetch<GeminiResponse>('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      params: {
        key: config.geminiApiKey
      },
      body: {
        contents: [{
          parts: [{
            text: `Buatkan artikel blog tentang ${body.prompt} yang menarik dan informatif.
            
            Berikan hasil dalam format berikut:
            
            1. Pendahuluan:
            [Pengenalan topik dan latar belakang]
            
            2. Pembahasan Utama:
            [Pembahasan detail tentang topik]
            
            3. Kesimpulan:
            [Ringkasan dan penutup]
            
            Gunakan bahasa Indonesia yang mudah dipahami dan berikan informasi yang bermanfaat bagi pembaca.`
          }]
        }]
      }
    });

    if (response.error) {
      throw new Error(response.error.message || "Failed to generate content");
    }

    return response;
  } catch (error: any) {
    console.error("Error generating content:", error);
    return { error: error.message || "Failed to generate content" };
  }
}); 