<script lang="ts">
  export let incident: {
    id: string;
    title: string;
    date: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    impact: string;
    summary: string;
    resolution: string;
    rootCause: string;
    correctiveActions: string[];
    duration: string;
    affectedSystems: string[];
  };
  
  export let searchTerm = '';
  
  const severityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };
  
  const severityText = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical'
  };
  
  let expanded = false;
  
  function highlightSearchTerm(text: string, term: string): string {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-500 text-black rounded px-1">$1</mark>');
  }
  
  function copyIncidentId() {
    navigator.clipboard.writeText(incident.id);
  }
  
  function shareIncident() {
    const url = `${window.location.origin}${window.location.pathname}#incident-${incident.id}`;
    navigator.clipboard.writeText(url);
  }
</script>

<div class="card bg-gray-800 border-l-4 border-{severityColors[incident.severity].replace('bg-', '')}">
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-lg font-semibold text-white mb-1">{@html highlightSearchTerm(incident.title, searchTerm)}</h3>
      <div class="flex items-center space-x-4 text-sm text-gray-400">
        <span>{incident.date}</span>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white {severityColors[incident.severity]}">
          {severityText[incident.severity]}
        </span>
        <span>{incident.duration}</span>
        <button 
          on:click={copyIncidentId}
          class="text-gray-400 hover:text-white transition-colors"
          title="Copy incident ID"
        >
          {incident.id}
        </button>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <button 
        on:click={shareIncident}
        class="p-2 text-gray-400 hover:text-white transition-colors"
        title="Share incident"
        aria-label="Share incident"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>
      <button 
        on:click={() => expanded = !expanded}
        class="p-2 text-gray-400 hover:text-white transition-colors"
        title="Toggle details"
        aria-label="Toggle details"
      >
        <svg class="w-5 h-5 transform transition-transform {expanded ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </div>
  
  <!-- Impact -->
  <div class="mb-4">
    <h4 class="text-sm font-medium text-gradient-gold mb-2">Impact</h4>
    <p class="text-gray-300 text-sm">{@html highlightSearchTerm(incident.impact, searchTerm)}</p>
  </div>
  
  <!-- Summary -->
  <div class="mb-4">
    <h4 class="text-sm font-medium text-gradient-gold mb-2">Summary</h4>
    <p class="text-gray-300 text-sm">{@html highlightSearchTerm(incident.summary, searchTerm)}</p>
  </div>
  
  {#if expanded}
    <!-- Resolution -->
    <div class="mb-4">
      <h4 class="text-sm font-medium text-gradient-gold mb-2">Resolution</h4>
      <p class="text-gray-300 text-sm">{incident.resolution}</p>
    </div>
    
    <!-- Root Cause Analysis -->
    <div class="mb-4">
      <h4 class="text-sm font-medium text-gradient-gold mb-2">Root Cause Analysis</h4>
      <p class="text-gray-300 text-sm">{incident.rootCause}</p>
    </div>
    
    <!-- Corrective Actions -->
    <div class="mb-4">
      <h4 class="text-sm font-medium text-gradient-gold mb-2">Corrective Actions</h4>
      <ul class="text-gray-300 text-sm space-y-1">
        {#each incident.correctiveActions as action}
          <li class="flex items-start">
            <span class="text-gradient-gold mr-2">•</span>
            {action}
          </li>
        {/each}
      </ul>
    </div>
    
    <!-- Affected Systems -->
    <div class="mb-4">
      <h4 class="text-sm font-medium text-gradient-gold mb-2">Affected Systems</h4>
      <div class="flex flex-wrap gap-2">
        {#each incident.affectedSystems as system}
          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300">
            {system}
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>