<template>
  <div class="bg-white shadow rounded-lg p-6">
    <form @submit.prevent="calculateWeton" class="space-y-6">
      <div>
        <label for="birthDate" class="block text-sm font-medium text-gray-700"
          >Tanggal Lahir</label
        >
        <input
          type="date"
          id="birthDate"
          v-model="birthDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label for="birthTime" class="block text-sm font-medium text-gray-700"
          >Waktu Lahir</label
        >
        <input
          type="time"
          id="birthTime"
          v-model="birthTime"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :disabled="loading"
      >
        {{ loading ? "Menghitung..." : "Hitung Weton" }}
      </button>
    </form>

    <div v-if="result" class="mt-6">
      <h2 class="text-lg font-medium text-gray-900">Hasil Perhitungan Weton</h2>
      <div class="mt-4 p-4 bg-gray-50 rounded-md space-y-4">
        <div
          v-for="(section, index) in formattedResult"
          :key="index"
          class="border-b border-gray-200 pb-4"
        >
          <h3 class="font-semibold text-gray-800">{{ section.title }}</h3>
          <p class="text-gray-700 mt-2">{{ section.content }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-6">
      <div class="p-4 bg-red-50 rounded-md">
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import axios from "axios";

const config = useRuntimeConfig();
const birthDate = ref("");
const birthTime = ref("");
const result = ref("");
const error = ref("");
const loading = ref(false);

const formattedResult = computed(() => {
  if (!result.value) return [];

  const sections = result.value.split("\n\n").filter(Boolean);
  return sections.map((section) => {
    const [title, ...content] = section.split("\n");
    return {
      title: title.replace(":", ""),
      content: content.join("\n"),
    };
  });
});

const calculateWeton = async () => {
  loading.value = true;
  error.value = "";
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${config.public.apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Hitung weton Jawa untuk tanggal lahir ${birthDate.value} pada pukul ${birthTime.value}. Berikan hasil dalam format berikut:
            
1. Hari dan Pasaran:
[Hasil perhitungan hari dan pasaran]

2. Neptu:
[Total neptu dan penjelasan]

3. Watak dan Sifat:
[Penjelasan watak dan sifat berdasarkan weton]

4. Ramalan Kehidupan:
[Ramalan singkat tentang kehidupan]

Gunakan bahasa Indonesia yang mudah dipahami dan fokus pada perhitungan weton Jawa.`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    result.value = response.data.candidates[0].content.parts[0].text;
  } catch (err) {
    console.error("Error:", err);
    if (err.response?.status === 401) {
      error.value =
        "API key tidak valid. Silakan periksa konfigurasi API key Anda.";
    } else {
      error.value =
        "Maaf, terjadi kesalahan dalam perhitungan. Silakan coba lagi.";
    }
  } finally {
    loading.value = false;
  }
};
</script>
