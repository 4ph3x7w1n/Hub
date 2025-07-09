<script lang="ts">
  export let title: string;
  export let description: string;
  export let icon: string;
  export let variant: 'primary' | 'secondary' | 'success' | 'warning' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let active: boolean = false;
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-gradient-start to-gradient-crimson',
    secondary: 'bg-gradient-to-r from-gradient-orange to-gradient-gold',
    success: 'bg-gradient-to-r from-green-500 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  };
  
  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg'
  };
  
  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };
</script>

<div class="card {variantClasses[variant]} {sizeClasses[size]} {active ? 'ring-2 ring-white ring-opacity-50' : ''} cursor-pointer group">
  <div class="flex items-center space-x-4">
    <div class="{iconSizes[size]} group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div class="flex-1">
      <h3 class="font-semibold text-white mb-1">{title}</h3>
      <p class="text-white/90 text-sm">{description}</p>
    </div>
  </div>
  
  {#if active}
    <div class="absolute top-2 right-2">
      <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
    </div>
  {/if}
</div>

<style>
  .card {
    position: relative;
    overflow: hidden;
  }
  
  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  .card:hover::before {
    transform: translateX(100%);
  }
</style>