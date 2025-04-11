<template>
  <div class="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
    <header class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-orange-600">
          Masukan Sembarang Kalir
        </h1>
        <p class="mt-2 text-gray-600">Generate By Gemini</p>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <RecipeGenerator />
      </div>
    </main>
  </div>
</template>

<script setup>
import RecipeGenerator from "./components/RecipeGenerator.vue";
</script>
