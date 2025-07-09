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
</script>

<div class="card bg-gray-800 border-l-4 border-{severityColors[incident.severity].replace('bg-', '')}">
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-lg font-semibold text-white mb-1">{incident.title}</h3>
      <div class="flex items-center space-x-4 text-sm text-gray-400">
        <span>{incident.date}</span>
        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white {severityColors[incident.severity]}">
          {severityText[incident.severity]}
        </span>
        <span>{incident.duration}</span>
      </div>
    </div>
    <button 
      on:click={() => expanded = !expanded}
      class="text-gray-400 hover:text-white transition-colors"
    >
      <svg class="w-5 h-5 transform transition-transform {expanded ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
  
  <!-- Impact -->
  <div class="mb-4">
    <h4 class="text-sm font-medium text-gradient-gold mb-2">Impact</h4>
    <p class="text-gray-300 text-sm">{incident.impact}</p>
  </div>
  
  <!-- Summary -->
  <div class="mb-4">
    <h4 class="text-sm font-medium text-gradient-gold mb-2">Summary</h4>
    <p class="text-gray-300 text-sm">{incident.summary}</p>
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