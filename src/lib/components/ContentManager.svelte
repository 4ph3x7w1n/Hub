<script lang="ts">
  import { contentStore } from '$lib/stores/content';
  import type { ContentData } from '$lib/stores/content';
  
  export let isOpen = false;
  
  let currentContent: ContentData;
  let activeTab: 'kpi' | 'team' | 'import' = 'kpi';
  let isEditing = false;
  let hasChanges = false;
  let importData = '';
  let importError = '';
  
  // Subscribe to content changes
  contentStore.subscribe(value => {
    currentContent = value;
  });
  
  function openManager() {
    isOpen = true;
    contentStore.load();
  }
  
  function closeManager() {
    isOpen = false;
    isEditing = false;
    hasChanges = false;
    importData = '';
    importError = '';
  }
  
  function toggleEdit() {
    isEditing = !isEditing;
    if (!isEditing && hasChanges) {
      saveChanges();
    }
  }
  
  function saveChanges() {
    contentStore.save({
      ...currentContent,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Admin'
    });
    hasChanges = false;
    isEditing = false;
  }
  
  function resetToDefaults() {
    if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      contentStore.reset();
      hasChanges = false;
      isEditing = false;
    }
  }
  
  function updateKPI(key: keyof import('$lib/stores/content').KPIData, field: string, value: string) {
    contentStore.updateKPI(key, { [field]: value } as any);
    hasChanges = true;
  }
  
  function updateTeamStats(field: string, value: string | string[]) {
    contentStore.updateTeamStats({ [field]: value });
    hasChanges = true;
  }
  
  function addRegion() {
    const newRegion = prompt('Enter new region name:');
    if (newRegion && newRegion.trim()) {
      const updatedRegions = [...currentContent.teamStats.regions, newRegion.trim()];
      updateTeamStats('regions', updatedRegions);
    }
  }
  
  function removeRegion(index: number) {
    const updatedRegions = currentContent.teamStats.regions.filter((_, i) => i !== index);
    updateTeamStats('regions', updatedRegions);
  }
  
  function addSpecialty() {
    const newSpecialty = prompt('Enter new specialty:');
    if (newSpecialty && newSpecialty.trim()) {
      const updatedSpecialties = [...currentContent.teamStats.specialties, newSpecialty.trim()];
      updateTeamStats('specialties', updatedSpecialties);
    }
  }
  
  function removeSpecialty(index: number) {
    const updatedSpecialties = currentContent.teamStats.specialties.filter((_, i) => i !== index);
    updateTeamStats('specialties', updatedSpecialties);
  }
  
  function exportData() {
    const dataStr = JSON.stringify(currentContent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `byte-content-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function importFromJSON() {
    if (!importData.trim()) {
      importError = 'Please enter JSON data to import';
      return;
    }
    
    try {
      const parsed = JSON.parse(importData);
      
      // Validate structure
      if (!parsed.teamStats || !parsed.kpiData) {
        importError = 'Invalid JSON structure. Missing required fields.';
        return;
      }
      
      contentStore.save({
        ...parsed,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Import'
      });
      
      importData = '';
      importError = '';
      activeTab = 'kpi';
      alert('Data imported successfully!');
    } catch (e) {
      importError = 'Invalid JSON format. Please check your data.';
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeManager();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- Floating admin button -->
<button
  on:click={openManager}
  class="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
  title="Content Manager"
  aria-label="Content Manager"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
</button>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div class="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b border-gray-700">
        <div>
          <h2 class="text-2xl font-bold text-white">Content Manager</h2>
          <p class="text-gray-400 text-sm mt-1">
            Last updated: {new Date(currentContent.lastUpdated).toLocaleString()} by {currentContent.updatedBy}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            on:click={toggleEdit}
            class="px-4 py-2 {isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </button>
          <button
            on:click={closeManager}
            class="text-gray-400 hover:text-white p-2"
            aria-label="Close content manager"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="flex border-b border-gray-700">
        <button
          on:click={() => activeTab = 'kpi'}
          class="px-6 py-3 {activeTab === 'kpi' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'} transition-colors"
        >
          KPI Data
        </button>
        <button
          on:click={() => activeTab = 'team'}
          class="px-6 py-3 {activeTab === 'team' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'} transition-colors"
        >
          Team Stats
        </button>
        <button
          on:click={() => activeTab = 'import'}
          class="px-6 py-3 {activeTab === 'import' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'} transition-colors"
        >
          Import/Export
        </button>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        {#if activeTab === 'kpi'}
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-white mb-4">KPI Metrics</h3>
            {#each Object.entries(currentContent.kpiData) as [key, kpi]}
              <div class="bg-gray-700 rounded-lg p-4">
                <h4 class="font-medium text-white mb-3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1" for="kpi-{key}-value">Value</label>
                    <input
                      id="kpi-{key}-value"
                      type="text"
                      value={kpi.value}
                      disabled={!isEditing}
                      on:input={(e) => updateKPI(key, 'value', (e.target as HTMLInputElement).value)}
                      class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1" for="kpi-{key}-trend-value">Trend Value</label>
                    <input
                      id="kpi-{key}-trend-value"
                      type="text"
                      value={kpi.trendValue}
                      disabled={!isEditing}
                      on:input={(e) => updateKPI(key, 'trendValue', (e.target as HTMLInputElement).value)}
                      class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1" for="kpi-{key}-trend">Trend</label>
                    <select
                      id="kpi-{key}-trend"
                      value={kpi.trend}
                      disabled={!isEditing}
                      on:change={(e) => updateKPI(key, 'trend', (e.target as HTMLSelectElement).value)}
                      class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white disabled:opacity-50"
                    >
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                      <option value="stable">Stable</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-1" for="kpi-{key}-subtitle">Subtitle</label>
                    <input
                      id="kpi-{key}-subtitle"
                      type="text"
                      value={kpi.subtitle}
                      disabled={!isEditing}
                      on:input={(e) => updateKPI(key, 'subtitle', (e.target as HTMLInputElement).value)}
                      class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {:else if activeTab === 'team'}
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-white mb-4">Team Statistics</h3>
            
            <div class="bg-gray-700 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1" for="team-size">Team Size</label>
                  <input
                    id="team-size"
                    type="text"
                    value={currentContent.teamStats.size}
                    disabled={!isEditing}
                    on:input={(e) => updateTeamStats('size', (e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1" for="team-coverage">Coverage</label>
                  <input
                    id="team-coverage"
                    type="text"
                    value={currentContent.teamStats.coverage}
                    disabled={!isEditing}
                    on:input={(e) => updateTeamStats('coverage', (e.target as HTMLInputElement).value)}
                    class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white disabled:opacity-50"
                  />
                </div>
              </div>
              
              <div class="mb-4">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-300">Regions</span>
                  {#if isEditing}
                    <button on:click={addRegion} class="text-blue-400 hover:text-blue-300 text-sm">+ Add Region</button>
                  {/if}
                </div>
                <div class="flex flex-wrap gap-2">
                  {#each currentContent.teamStats.regions as region, index}
                    <div class="flex items-center bg-gray-600 rounded px-3 py-1">
                      <span class="text-white text-sm">{region}</span>
                      {#if isEditing}
                        <button on:click={() => removeRegion(index)} class="ml-2 text-red-400 hover:text-red-300" aria-label="Remove region {region}">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
              
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-300">Specialties</span>
                  {#if isEditing}
                    <button on:click={addSpecialty} class="text-blue-400 hover:text-blue-300 text-sm">+ Add Specialty</button>
                  {/if}
                </div>
                <div class="flex flex-wrap gap-2">
                  {#each currentContent.teamStats.specialties as specialty, index}
                    <div class="flex items-center bg-gray-600 rounded px-3 py-1">
                      <span class="text-white text-sm">{specialty}</span>
                      {#if isEditing}
                        <button on:click={() => removeSpecialty(index)} class="ml-2 text-red-400 hover:text-red-300" aria-label="Remove specialty {specialty}">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        {:else if activeTab === 'import'}
          <div class="space-y-6">
            <h3 class="text-lg font-semibold text-white mb-4">Import/Export Data</h3>
            
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-3">Export Current Data</h4>
              <p class="text-gray-400 text-sm mb-4">Download current content as JSON file for backup or sharing.</p>
              <button
                on:click={exportData}
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Export Data
              </button>
            </div>
            
            <div class="bg-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-white mb-3">Import Data</h4>
              <p class="text-gray-400 text-sm mb-4">Paste JSON data to import new content. This will overwrite current data.</p>
              <textarea
                bind:value={importData}
                rows="6"
                class="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 resize-none mb-4"
                placeholder="Paste JSON data here..."
              ></textarea>
              {#if importError}
                <p class="text-red-400 text-sm mb-4">{importError}</p>
              {/if}
              <div class="flex space-x-2">
                <button
                  on:click={importFromJSON}
                  disabled={!importData.trim()}
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Import Data
                </button>
                <button
                  on:click={() => { importData = ''; importError = ''; }}
                  class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <div class="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <h4 class="font-medium text-red-400 mb-3">Reset to Defaults</h4>
              <p class="text-red-300 text-sm mb-4">This will permanently delete all custom content and restore defaults.</p>
              <button
                on:click={resetToDefaults}
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}