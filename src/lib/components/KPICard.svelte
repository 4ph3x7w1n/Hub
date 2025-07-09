<script lang="ts">
  export let title: string;
  export let value: string;
  export let subtitle: string = '';
  export let trend: 'up' | 'down' | 'stable' = 'stable';
  export let trendValue: string = '';
  export let icon: string = '';
  export let gradient: 'primary' | 'secondary' | 'tertiary' = 'primary';
  
  const gradientClasses = {
    primary: 'bg-card-gradient',
    secondary: 'bg-feature-gradient',
    tertiary: 'bg-gradient-to-br from-gradient-gold to-gradient-end'
  };
  
  const trendIcons = {
    up: '↗️',
    down: '↘️',
    stable: '➡️'
  };
  
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-gray-400'
  };
</script>

<div class="card {gradientClasses[gradient]} animate-scale-in hover:glow">
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      {#if icon}
        <div class="text-2xl">{icon}</div>
      {/if}
      <h3 class="text-lg font-semibold text-white">{title}</h3>
    </div>
    {#if trendValue}
      <div class="flex items-center space-x-1 {trendColors[trend]}">
        <span class="text-sm font-medium">{trendValue}</span>
        <span>{trendIcons[trend]}</span>
      </div>
    {/if}
  </div>
  
  <div class="text-3xl font-bold text-white mb-2">{value}</div>
  
  {#if subtitle}
    <div class="text-sm text-gray-300">{subtitle}</div>
  {/if}
</div>