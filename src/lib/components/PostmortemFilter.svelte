<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let searchTerm = '';
  export let selectedSeverity = 'all';
  export let selectedTimeframe = 'all';
  export let sortBy = 'date';
  export let sortOrder = 'desc';
  
  const dispatch = createEventDispatcher();
  
  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];
  
  const timeframeOptions = [
    { value: 'all', label: 'All Time' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];
  
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'severity', label: 'Severity' },
    { value: 'duration', label: 'Duration' },
    { value: 'title', label: 'Title' }
  ];
  
  function handleSearch(e: Event) {
    const target = e.target as HTMLInputElement;
    searchTerm = target.value;
    dispatch('filter', { searchTerm, selectedSeverity, selectedTimeframe, sortBy, sortOrder });
  }
  
  function handleSeverityChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    selectedSeverity = target.value;
    dispatch('filter', { searchTerm, selectedSeverity, selectedTimeframe, sortBy, sortOrder });
  }
  
  function handleTimeframeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    selectedTimeframe = target.value;
    dispatch('filter', { searchTerm, selectedSeverity, selectedTimeframe, sortBy, sortOrder });
  }
  
  function handleSortChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    sortBy = target.value;
    dispatch('filter', { searchTerm, selectedSeverity, selectedTimeframe, sortBy, sortOrder });
  }
  
  function toggleSortOrder() {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch('filter', { searchTerm, selectedSeverity, selectedTimeframe, sortBy, sortOrder });
  }
  
  function clearFilters() {
    searchTerm = '';
    selectedSeverity = 'all';
    selectedTimeframe = 'all';
    sortBy = 'date';
    sortOrder = 'desc';
    dispatch('filter', { searchTerm, selectedSeverity, selectedTimeframe, sortBy, sortOrder });
  }
</script>

<div class="bg-gray-800 rounded-lg p-6 mb-8">
  <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
    <!-- Search Input -->
    <div class="flex-1 min-w-0">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          bind:value={searchTerm}
          on:input={handleSearch}
          placeholder="Search postmortems..."
          class="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
        />
      </div>
    </div>
    
    <!-- Filters -->
    <div class="flex flex-wrap gap-2 lg:gap-4 items-center">
      <select 
        bind:value={selectedSeverity}
        on:change={handleSeverityChange}
        class="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
      >
        {#each severityOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      
      <select 
        bind:value={selectedTimeframe}
        on:change={handleTimeframeChange}
        class="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
      >
        {#each timeframeOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      
      <div class="flex items-center gap-2">
        <select 
          bind:value={sortBy}
          on:change={handleSortChange}
          class="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
        >
          {#each sortOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        
        <button
          on:click={toggleSortOrder}
          class="p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 hover:text-white transition-colors"
          title="Toggle sort order"
        >
          {#if sortOrder === 'desc'}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          {/if}
        </button>
      </div>
      
      <button
        on:click={clearFilters}
        class="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors"
      >
        Clear
      </button>
    </div>
  </div>
</div>