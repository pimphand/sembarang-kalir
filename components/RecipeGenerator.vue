<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Name Input Modal -->
    <div
      v-if="!userName"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-2xl p-8 max-w-md w-full">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">
          Masukkan Nama Anda
        </h3>
        <div class="space-y-4">
          <input
            type="text"
            v-model="tempUserName"
            placeholder="Nama Anda"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            @keyup.enter="saveUserName"
          />
          <button
            @click="saveUserName"
            class="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="mb-8">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="generateContent"
          placeholder="Masukkan topik blog (contoh: tips belajar coding, review film terbaru, tutorial memasak...)"
          class="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-lg shadow-sm"
        />
        <button
          @click="generateContent"
          :disabled="loading"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          {{ loading ? "Generating..." : "Generate" }}
        </button>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <div class="bg-white rounded-xl p-8 flex flex-col items-center gap-4">
        <svg
          class="animate-spin h-12 w-12 text-orange-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-lg font-medium text-gray-900">Generating content...</p>
      </div>
    </div>

    <!-- Result Section -->
    <div
      v-if="result"
      class="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Blog Post</h2>
          <button
            @click="copyContent"
            class="text-orange-600 hover:text-orange-700 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path
                d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
              />
            </svg>
            Salin Konten
          </button>
        </div>
      </div>
      <div class="p-6 space-y-6">
        <div
          v-for="(section, index) in formattedResult"
          :key="index"
          class="bg-orange-50 rounded-xl p-6 shadow-sm"
        >
          <h3 class="text-xl font-semibold text-orange-800 mb-4">
            {{ section.title }}
          </h3>
          <div class="prose prose-orange max-w-none">
            <div v-html="formatContent(section.content)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog List Section -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Daftar Blog Post</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(post, index) in savedPosts"
          :key="index"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
          @click="viewPostDetails(post)"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ post.title }}
                </h3>
                <p class="text-sm text-gray-500">Oleh: {{ post.author }}</p>
              </div>
              <span
                class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
              >
                {{ formatDate(post.date) }}
              </span>
            </div>
            <div class="text-sm text-gray-600 line-clamp-3">
              {{ getPreview(post.content) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Blog Post Details Modal -->
    <div
      v-if="showPostModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">
              {{ selectedPost?.title }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Oleh: {{ selectedPost?.author }}
            </p>
          </div>
          <button
            @click="showPostModal = false"
            class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="space-y-6">
          <div
            v-for="(section, index) in formattedPost(selectedPost?.content)"
            :key="index"
            class="bg-gray-50 rounded-xl p-6"
          >
            <h4 class="text-lg font-semibold text-gray-800 mb-3">
              {{ section.title }}
            </h4>
            <div class="prose prose-gray max-w-none">
              <div v-html="formatContent(section.content)"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Section -->
    <footer class="mt-12 pt-8 border-t border-gray-200">
      <div class="flex flex-col items-center justify-center space-y-2">
        <p class="text-gray-600 text-sm">
          Created by <span class="font-semibold">DMPT</span>
        </p>
        <a
          href="https://instagram.com/f.damri_"
          target="_blank"
          rel="noopener noreferrer"
          class="text-orange-600 hover:text-orange-700 flex items-center gap-2 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            />
          </svg>
          @f.damri
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const searchQuery = ref("");
const result = ref("");
const error = ref("");
const loading = ref(false);
const showPostModal = ref(false);
const selectedPost = ref(null);
const savedPosts = ref([]);
const tempUserName = ref("");
const userName = ref("");

// Load user name from cookie
onMounted(() => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("blog_user="));

  if (cookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
      if (userData.expires > Date.now()) {
        userName.value = userData.name;
      }
    } catch (e) {
      console.error("Error parsing cookie:", e);
    }
  }
  loadPosts();
});

const saveUserName = () => {
  if (tempUserName.value.trim()) {
    userName.value = tempUserName.value.trim();
    // Save to cookie with 30 days expiration
    const expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const userData = {
      name: userName.value,
      expires: expires,
    };

    // Set cookie with proper encoding
    const cookieValue = encodeURIComponent(JSON.stringify(userData));
    const expiresDate = new Date(expires).toUTCString();
    document.cookie = `blog_user=${cookieValue}; expires=${expiresDate}; path=/`;

    // Clear the temporary name
    tempUserName.value = "";
  }
};

const generateContent = async () => {
  if (!userName.value) return;

  try {
    loading.value = true;
    error.value = null;
    result.value = null;

    // Content safety check
    const unsafeTopics = [
      "pornografi",
      "porno",
      "dewasa",
      "18+",
      "xxx",
      "judi",
      "gambling",
      "slot",
      "casino",
      "rasis",
      "rasisme",
      "diskriminasi",
      "hate speech",
      "kekerasan",
      "violence",
      "crime",
      "criminal",
      "narkoba",
      "drugs",
      "narkotika",
      "obat terlarang",
    ];

    const query = searchQuery.value.toLowerCase();
    if (unsafeTopics.some((topic) => query.includes(topic))) {
      throw new Error(
        "Mohon maaf, topik yang Anda masukkan tidak sesuai dengan kebijakan konten kami. Silakan pilih topik yang lebih positif dan bermanfaat."
      );
    }

    const prompt = `Buatkan artikel blog yang positif dan bermanfaat tentang ${searchQuery.value}.
    Artikel harus memenuhi kriteria berikut:
    1. Konten yang aman dan sesuai untuk semua usia
    2. Tidak mengandung unsur negatif, kekerasan, atau konten yang tidak pantas
    3. Menyajikan informasi yang akurat dan bermanfaat
    4. Menggunakan bahasa yang sopan dan profesional
    
    Format artikel:
    1. Pendahuluan: Jelaskan topik secara umum dan pentingnya
    2. Pembahasan Utama: Berikan informasi detail dengan contoh yang relevan
    3. Kesimpulan: Ringkasan dan saran positif untuk pembaca
    
    Pastikan artikel:
    - Menggunakan bahasa Indonesia yang baik dan benar
    - Menyajikan informasi yang akurat dan dapat dipertanggungjawabkan
    - Memberikan nilai tambah bagi pembaca
    - Menghindari konten yang sensitif atau kontroversial`;

    const response = await $fetch("/api/generate-content", {
      method: "POST",
      body: { prompt },
    });

    if (response.error) {
      throw new Error(response.error);
    }

    const contentText =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      response.text ||
      response;

    if (!contentText) {
      throw new Error("Tidak dapat mendapatkan konten dari respons");
    }

    // Additional content safety check
    const unsafeContent = unsafeTopics.some((topic) =>
      contentText.toLowerCase().includes(topic)
    );

    if (unsafeContent) {
      throw new Error(
        "Mohon maaf, konten yang dihasilkan tidak sesuai dengan kebijakan kami. Silakan coba dengan topik yang berbeda."
      );
    }

    const formattedText = contentText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)
      .join("\n");

    result.value = formattedText;

    // Auto-save the generated content
    const postData = {
      title: searchQuery.value,
      author: userName.value,
      content: formattedText,
      date: new Date().toISOString(),
    };

    await savePostToJson(postData);
  } catch (err) {
    error.value = err.message || "Terjadi kesalahan saat membuat konten";
  } finally {
    loading.value = false;
  }
};

const savePostToJson = async (postData) => {
  try {
    const response = await $fetch("/api/save-post", {
      method: "POST",
      body: { post: postData },
    });
    if (response.error) {
      throw new Error(response.error);
    }
    await loadPosts();
  } catch (err) {
    console.error("Error saving post:", err);
  }
};

const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(result.value);
    alert("Konten berhasil disalin!");
  } catch (err) {
    console.error("Gagal menyalin konten:", err);
  }
};

const formattedResult = computed(() => {
  if (!result.value) return [];

  const sections = result.value.split("\n\n").filter(Boolean);

  return sections.map((section) => {
    const lines = section.split("\n");
    const title = lines[0]
      .replace(/^\d+\.\s*/, "")
      .replace(":", "")
      .trim();
    const content = lines.slice(1).join("\n").trim();

    return {
      title: title,
      content: content,
    };
  });
});

const viewPostDetails = (post) => {
  selectedPost.value = post;
  showPostModal.value = true;
};

const loadPosts = async () => {
  try {
    const response = await $fetch("/api/posts");
    savedPosts.value = response.posts || [];
  } catch (err) {
    console.error("Error loading posts:", err);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formattedPost = (content) => {
  if (!content) return [];
  return content.split("\n\n").map((section) => {
    const lines = section.split("\n");
    const title = lines[0]
      .replace(/^\d+\.\s*/, "")
      .replace(":", "")
      .trim();
    const content = lines.slice(1).join("\n").trim();
    return { title, content };
  });
};

const getPreview = (content) => {
  if (!content) return "";
  const firstSection = content.split("\n\n")[0];
  return firstSection.split("\n").slice(1).join(" ").substring(0, 150) + "...";
};

const formatContent = (content) => {
  if (!content) return "";

  // Split content into paragraphs
  const paragraphs = content.split("\n\n");

  return paragraphs
    .map((paragraph) => {
      // Check if paragraph contains code blocks
      if (paragraph.includes("```")) {
        // Extract language and code
        const match = paragraph.match(/```(\w+)?\n([\s\S]*?)```/);
        if (match) {
          const [, language, code] = match;
          return `<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto"><code class="language-${
            language || "plaintext"
          }">${code.trim()}</code></pre>`;
        }
      }

      // Format ordered lists (numbered)
      if (paragraph.match(/^\d+\.\s/)) {
        const items = paragraph.split("\n").filter((line) => line.trim());
        return `<ol class="list-decimal pl-6 space-y-2">${items
          .map((item) => {
            const text = item.replace(/^\d+\.\s*/, "").trim();
            return `<li class="text-gray-700">${text}</li>`;
          })
          .join("")}</ol>`;
      }

      // Format unordered lists (bullet points)
      if (paragraph.startsWith("- ") || paragraph.startsWith("• ")) {
        const items = paragraph.split("\n").filter((line) => line.trim());
        return `<ul class="list-disc pl-6 space-y-2">${items
          .map((item) => {
            const text = item.replace(/^[-•]\s*/, "").trim();
            return `<li class="text-gray-700">${text}</li>`;
          })
          .join("")}</ul>`;
      }

      // Format nested lists
      if (paragraph.includes("  - ") || paragraph.includes("  • ")) {
        const lines = paragraph.split("\n");
        let currentList = "";
        let currentItems = [];

        lines.forEach((line) => {
          if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
            if (currentItems.length > 0) {
              currentList += `<ul class="list-disc pl-6 space-y-2">${currentItems.join(
                ""
              )}</ul>`;
              currentItems = [];
            }
            const text = line.replace(/^[-•]\s*/, "").trim();
            currentItems.push(`<li class="text-gray-700">${text}</li>`);
          } else if (
            line.trim().startsWith("  - ") ||
            line.trim().startsWith("  • ")
          ) {
            const text = line.replace(/^\s+[-•]\s*/, "").trim();
            currentItems.push(`<li class="text-gray-700 pl-4">${text}</li>`);
          }
        });

        if (currentItems.length > 0) {
          currentList += `<ul class="list-disc pl-6 space-y-2">${currentItems.join(
            ""
          )}</ul>`;
        }

        return currentList;
      }

      // Format headings
      if (paragraph.startsWith("## ")) {
        return `<h2 class="text-xl font-bold text-gray-900 mt-6 mb-4">${paragraph.replace(
          "## ",
          ""
        )}</h2>`;
      }
      if (paragraph.startsWith("### ")) {
        return `<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-2">${paragraph.replace(
          "### ",
          ""
        )}</h3>`;
      }

      // Format links
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      paragraph = paragraph.replace(
        linkRegex,
        '<a href="$2" class="text-orange-600 hover:text-orange-700 underline">$1</a>'
      );

      // Format inline code
      paragraph = paragraph.replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      );

      // Format bold and italic using HTML tags
      paragraph = paragraph.replace(
        /\*\*([^*]+)\*\*/g,
        '<b class="font-bold text-gray-900">$1</b>'
      );
      paragraph = paragraph.replace(
        /\*([^*]+)\*/g,
        '<i class="italic text-gray-700">$1</i>'
      );

      // Format blockquotes
      if (paragraph.startsWith("> ")) {
        return `<blockquote class="border-l-4 border-orange-500 pl-4 my-4 text-gray-600 italic">${paragraph.replace(
          "> ",
          ""
        )}</blockquote>`;
      }

      // Format horizontal rules
      if (paragraph.trim() === "---" || paragraph.trim() === "***") {
        return '<hr class="my-6 border-gray-200">';
      }

      // Format tables
      if (paragraph.includes("|")) {
        const rows = paragraph.split("\n");
        if (rows.length > 1) {
          const headers = rows[0]
            .split("|")
            .map((h) => h.trim())
            .filter((h) => h);
          const alignments = rows[1]
            .split("|")
            .map((a) => a.trim().replace(/-/g, ""));
          const dataRows = rows.slice(2);

          let table =
            '<div class="overflow-x-auto"><table class="min-w-full border border-gray-200">';

          // Table header
          table += "<thead><tr>";
          headers.forEach((header, i) => {
            const align = alignments[i] || "left";
            table += `<th class="px-4 py-2 bg-gray-50 border-b border-gray-200 text-${align}">${header}</th>`;
          });
          table += "</tr></thead>";

          // Table body
          table += "<tbody>";
          dataRows.forEach((row) => {
            const cells = row
              .split("|")
              .map((c) => c.trim())
              .filter((c) => c);
            table += "<tr>";
            cells.forEach((cell, i) => {
              const align = alignments[i] || "left";
              table += `<td class="px-4 py-2 border-b border-gray-200 text-${align}">${cell}</td>`;
            });
            table += "</tr>";
          });
          table += "</tbody></table></div>";

          return table;
        }
      }

      return `<p class="text-gray-700 leading-relaxed mb-4">${paragraph}</p>`;
    })
    .join("");
};
</script>

<style scoped>
.typing {
  border-right: 2px solid;
  animation: typing 1s steps(40, end), blink-caret 0.75s step-end infinite;
  white-space: pre-wrap;
  overflow: hidden;
  display: inline-block;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: orange;
  }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(pre) {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

:deep(code) {
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  line-height: 1.5;
}

:deep(.language-javascript) {
  color: #f3f4f6;
}

:deep(.language-html) {
  color: #f3f4f6;
}

:deep(.language-css) {
  color: #f3f4f6;
}

:deep(.language-python) {
  color: #f3f4f6;
}

:deep(.language-bash) {
  color: #f3f4f6;
}

:deep(.language-json) {
  color: #f3f4f6;
}

:deep(.language-markdown) {
  color: #f3f4f6;
}

:deep(.language-plaintext) {
  color: #f3f4f6;
}

:deep(a) {
  color: #ea580c;
  text-decoration: underline;
}

:deep(a:hover) {
  color: #c2410c;
}

:deep(b) {
  font-weight: 600;
  color: #1f2937;
}

:deep(i) {
  font-style: italic;
}

:deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(li) {
  margin: 0.5rem 0;
}

:deep(blockquote) {
  border-left: 4px solid #ea580c;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #4b5563;
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

:deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
  text-align: left;
}

:deep(td) {
  border-bottom: 1px solid #e5e7eb;
}

:deep(tr:hover) {
  background-color: #f9fafb;
}
</style>
