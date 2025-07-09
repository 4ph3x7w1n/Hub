<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import KPICard from '$lib/components/KPICard.svelte';
  import FeatureBadge from '$lib/components/FeatureBadge.svelte';
  import PostmortemCard from '$lib/components/PostmortemCard.svelte';
  import Chart from '$lib/components/Chart.svelte';
  import { kpiData, chartData, features, postmortemData, capabilities, teamStats } from '$lib/data/mockData';
  import { onMount } from 'svelte';
  
  let scrollY = 0;
  
  onMount(() => {
    const handleScroll = () => scrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:window bind:scrollY />

<Navigation />

<!-- Hero Section -->
<section id="hero" class="min-h-screen flex items-center justify-center bg-hero-gradient relative overflow-hidden">
  <div class="absolute inset-0 bg-black/20"></div>
  <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
    <div class="text-6xl font-bold mb-4 text-white text-shadow animate-fade-in">
      <span class="block mb-2">BYTE LOGO</span>
      <span class="text-4xl font-normal">Incident Management</span>
    </div>
    <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
      Ensuring system reliability and rapid incident response across global infrastructure with 24/7 monitoring, proactive alerts, and expert analysis.
    </p>
    <div class="flex justify-center space-x-6 animate-scale-in">
      <button class="btn-primary" on:click={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
        Learn More
      </button>
      <button class="btn-secondary" on:click={() => document.getElementById('metrics')?.scrollIntoView({ behavior: 'smooth' })}>
        View Metrics
      </button>
    </div>
  </div>
</section>

<!-- About Section -->
<section id="about" class="section bg-gray-900">
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold gradient-text mb-4">About Our Team</h2>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
      The Byte Incident Management Team provides comprehensive support for global infrastructure operations, ensuring minimal downtime and maximum system performance.
    </p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <div class="card text-center">
      <div class="text-3xl mb-4">👥</div>
      <h3 class="text-xl font-semibold mb-2">Team Size</h3>
      <p class="text-gray-400">{teamStats.size}</p>
    </div>
    <div class="card text-center">
      <div class="text-3xl mb-4">⏰</div>
      <h3 class="text-xl font-semibold mb-2">Coverage</h3>
      <p class="text-gray-400">{teamStats.coverage}</p>
    </div>
    <div class="card text-center">
      <div class="text-3xl mb-4">🌍</div>
      <h3 class="text-xl font-semibold mb-2">Global Reach</h3>
      <p class="text-gray-400">{teamStats.regions.length} Regions</p>
    </div>
    <div class="card text-center">
      <div class="text-3xl mb-4">🔧</div>
      <h3 class="text-xl font-semibold mb-2">Specialties</h3>
      <p class="text-gray-400">{teamStats.specialties.length} Areas</p>
    </div>
  </div>
</section>

<!-- Core Capabilities Section -->
<section id="capabilities" class="section bg-gray-800">
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold gradient-text mb-4">Core Capabilities</h2>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
      Our comprehensive approach to incident management combines proactive monitoring, rapid response, and thorough analysis.
    </p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {#each capabilities as capability}
      <div class="card">
        <div class="flex items-start space-x-4">
          <div class="text-4xl">{capability.icon}</div>
          <div>
            <h3 class="text-xl font-semibold mb-2 text-white">{capability.title}</h3>
            <p class="text-gray-400">{capability.description}</p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- Interactive Metrics Dashboard -->
<section id="metrics" class="section bg-gray-900">
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold gradient-text mb-4">Impact & Metrics</h2>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
      Real-time performance indicators showcasing our commitment to rapid response and system reliability.
    </p>
  </div>
  
  <!-- KPI Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
    <KPICard 
      title="MTTA" 
      value={kpiData.mtta.value}
      subtitle={kpiData.mtta.subtitle}
      trend={kpiData.mtta.trend}
      trendValue={kpiData.mtta.trendValue}
      icon="⚡"
      gradient="primary"
    />
    <KPICard 
      title="MTTR" 
      value={kpiData.mttr.value}
      subtitle={kpiData.mttr.subtitle}
      trend={kpiData.mttr.trend}
      trendValue={kpiData.mttr.trendValue}
      icon="🔧"
      gradient="secondary"
    />
    <KPICard 
      title="Incidents" 
      value={kpiData.incidentCount.value}
      subtitle={kpiData.incidentCount.subtitle}
      trend={kpiData.incidentCount.trend}
      trendValue={kpiData.incidentCount.trendValue}
      icon="📊"
      gradient="tertiary"
    />
    <KPICard 
      title="Coverage" 
      value={kpiData.coverage.value}
      subtitle={kpiData.coverage.subtitle}
      trend={kpiData.coverage.trend}
      trendValue={kpiData.coverage.trendValue}
      icon="🌍"
      gradient="primary"
    />
    <KPICard 
      title="Uptime" 
      value={kpiData.uptime.value}
      subtitle={kpiData.uptime.subtitle}
      trend={kpiData.uptime.trend}
      trendValue={kpiData.uptime.trendValue}
      icon="✅"
      gradient="secondary"
    />
  </div>
  
  <!-- Charts -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="card">
      <h3 class="text-xl font-semibold mb-4 text-white">Incident Trends</h3>
      <Chart type="line" data={chartData.incidentTrend} height={300} />
    </div>
    <div class="card">
      <h3 class="text-xl font-semibold mb-4 text-white">Proactive vs Reactive</h3>
      <Chart type="doughnut" data={chartData.proactiveVsReactive} height={300} />
    </div>
  </div>
</section>

<!-- Features Showcase -->
<section id="features" class="section bg-gray-800">
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold gradient-text mb-4">Key Features</h2>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
      Advanced capabilities that ensure comprehensive incident management and system reliability.
    </p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each features as feature}
      <FeatureBadge 
        title={feature.title}
        description={feature.description}
        icon={feature.icon}
        variant={feature.variant}
        active={feature.active}
      />
    {/each}
  </div>
</section>

<!-- Postmortems & Analysis -->
<section id="postmortems" class="section bg-gray-900">
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold gradient-text mb-4">Postmortems & Analysis</h2>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
      Comprehensive incident analysis with detailed root cause investigations and corrective actions.
    </p>
  </div>
  
  <div class="space-y-6">
    {#each postmortemData as incident}
      <PostmortemCard {incident} />
    {/each}
  </div>
</section>

<!-- Contact Section -->
<section id="contact" class="section bg-gray-800">
  <div class="text-center mb-12">
    <h2 class="text-4xl font-bold gradient-text mb-4">Contact Us</h2>
    <p class="text-xl text-gray-300 max-w-3xl mx-auto">
      Get in touch with our team for incident reporting, escalations, or general inquiries.
    </p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="card text-center">
      <div class="text-4xl mb-4">💬</div>
      <h3 class="text-xl font-semibold mb-2 text-white">Slack</h3>
      <p class="text-gray-400 mb-4">Join our incident response channel</p>
      <button class="btn-primary">#byte-incidents</button>
    </div>
    <div class="card text-center">
      <div class="text-4xl mb-4">📧</div>
      <h3 class="text-xl font-semibold mb-2 text-white">Email</h3>
      <p class="text-gray-400 mb-4">Direct email for urgent matters</p>
      <button class="btn-secondary">byteincidentmanagement@yum.com</button>
    </div>
    <div class="card text-center">
      <div class="text-4xl mb-4">🚨</div>
      <h3 class="text-xl font-semibold mb-2 text-white">Escalation</h3>
      <p class="text-gray-400 mb-4">Emergency escalation form</p>
      <button class="btn-primary">Escalation Form</button>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="bg-gray-900 border-t border-gray-700 py-8">
  <div class="max-w-7xl mx-auto px-4 text-center">
    <div class="flex justify-center space-x-8 mb-4">
      <a href="#" class="text-gray-400 hover:text-white transition-colors">Documentation</a>
      <a href="#" class="text-gray-400 hover:text-white transition-colors">SLA</a>
      <a href="#" class="text-gray-400 hover:text-white transition-colors">OLA</a>
      <a href="#" class="text-gray-400 hover:text-white transition-colors">Runbooks</a>
    </div>
    <p class="text-gray-400">© 2024 Byte Incident Management Team. All rights reserved.</p>
  </div>
</footer>