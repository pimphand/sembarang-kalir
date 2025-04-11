<template>
  <div class="mt-6">
    <!-- Saved Recipes List -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-orange-800">Resep Tersimpan</h3>
        <div class="flex items-center gap-2">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Cari resep..."
            class="px-3 py-2 rounded-md border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm"
          />
          <button
            @click="toggleRecipeList"
            class="text-orange-600 hover:text-orange-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div v-if="showRecipeList" class="space-y-2 max-h-60 overflow-y-auto">
        <div
          v-for="(recipe, index) in filteredRecipes"
          :key="index"
          class="bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          @click="viewRecipe(recipe)"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-gray-900">{{ recipe.name }}</h4>
              <p class="text-sm text-gray-500">Oleh: {{ recipe.author }}</p>
            </div>
            <span class="text-xs text-gray-500">{{
              formatDate(recipe.date)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Recipe Form -->
    <div class="bg-orange-50 p-4 rounded-lg">
      <h3 class="text-lg font-medium text-orange-800 mb-4">Simpan Resep</h3>
      <form @submit.prevent="saveRecipe" class="space-y-4">
        <div>
          <label
            for="authorName"
            class="block text-sm font-medium text-gray-700"
          >
            Nama Pembuat
          </label>
          <input
            type="text"
            id="authorName"
            v-model="authorName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            for="recipeName"
            class="block text-sm font-medium text-gray-700"
          >
            Nama Resep
          </label>
          <input
            type="text"
            id="recipeName"
            v-model="recipeName"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            for="recipeReference"
            class="block text-sm font-medium text-gray-700"
          >
            Referensi Resep
          </label>
          <input
            type="text"
            id="recipeReference"
            v-model="recipeReference"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            placeholder="Contoh: Resep tradisional Jawa"
          />
        </div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Simpan Resep
        </button>
      </form>
    </div>

    <!-- View Recipe Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ selectedRecipe?.name }}
            </h3>
            <p class="text-sm text-gray-500">
              Oleh: {{ selectedRecipe?.author }}
            </p>
          </div>
          <button
            @click="showModal = false"
            class="text-gray-500 hover:text-gray-700"
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
        <div class="space-y-4">
          <div
            v-for="(section, index) in formattedRecipe"
            :key="index"
            class="border-b border-gray-200 pb-4"
          >
            <h4 class="font-semibold text-gray-800">{{ section.title }}</h4>
            <p class="text-gray-700 mt-2">{{ section.content }}</p>
          </div>
          <div
            v-if="selectedRecipe?.reference"
            class="mt-4 text-sm text-gray-500"
          >
            Referensi: {{ selectedRecipe.reference }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const recipeName = ref("");
const authorName = ref("");
const recipeReference = ref("");
const savedRecipes = ref([]);
const showModal = ref(false);
const selectedRecipe = ref(null);
const showRecipeList = ref(true);
const searchQuery = ref("");

const filteredRecipes = computed(() => {
  if (!searchQuery.value) return savedRecipes.value;

  const query = searchQuery.value.toLowerCase();
  return savedRecipes.value.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(query) ||
      recipe.author.toLowerCase().includes(query)
  );
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const saveRecipe = () => {
  const recipeData = {
    name: recipeName.value,
    author: authorName.value,
    recipe: props.result,
    reference: recipeReference.value,
    date: new Date().toISOString(),
  };

  // Get existing recipes from localStorage
  const existingRecipes = JSON.parse(
    localStorage.getItem("savedRecipes") || "[]"
  );
  existingRecipes.push(recipeData);
  localStorage.setItem("savedRecipes", JSON.stringify(existingRecipes));

  // Update the saved recipes list
  savedRecipes.value = existingRecipes;

  // Clear form
  recipeName.value = "";
  authorName.value = "";
  recipeReference.value = "";
};

const viewRecipe = (recipe) => {
  selectedRecipe.value = recipe;
  showModal.value = true;
};

const toggleRecipeList = () => {
  showRecipeList.value = !showRecipeList.value;
};

// Load saved recipes on component mount
onMounted(() => {
  const recipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
  savedRecipes.value = recipes;
});

const props = defineProps({
  result: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.recipe-list-enter-active,
.recipe-list-leave-active {
  transition: all 0.3s ease;
}

.recipe-list-enter-from,
.recipe-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
