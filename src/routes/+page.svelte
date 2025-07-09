<script lang="ts">
  import Navigation from '$lib/components/Navigation.svelte';
  import KPICard from '$lib/components/KPICard.svelte';
  import FeatureBadge from '$lib/components/FeatureBadge.svelte';
  import PostmortemCard from '$lib/components/PostmortemCard.svelte';
  import PostmortemFilter from '$lib/components/PostmortemFilter.svelte';
  import Chart from '$lib/components/Chart.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import ContentManager from '$lib/components/ContentManager.svelte';
  import { kpiData, chartData, features, postmortemData, capabilities, teamStats } from '$lib/data/mockData';
  import { contentStore } from '$lib/stores/content';
  import { fetchDashboardData, refreshDashboard } from '$lib/services/dashboard';
  import { initializeIncidentIo } from '$lib/env';
  import { onMount } from 'svelte';
  
  let scrollY = 0;
  let dynamicKpiData = kpiData;
  let dynamicTeamStats = teamStats;
  let isLoadingRealData = false;
  let lastUpdated = '';
  let apiStatus: 'healthy' | 'error' | 'checking' = 'checking';
  let useRealData = false;
  
  // Postmortem filtering
  let filteredPostmortems = postmortemData;
  let searchTerm = '';
  let filterCriteria = {
    searchTerm: '',
    selectedSeverity: 'all',
    selectedTimeframe: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  };
  
  // Subscribe to content store
  contentStore.subscribe(content => {
    dynamicKpiData = content.kpiData as any;
    dynamicTeamStats = content.teamStats;
  });
  
  function handlePostmortemFilter(event: CustomEvent) {
    filterCriteria = event.detail;
    searchTerm = filterCriteria.searchTerm;
    filteredPostmortems = filterPostmortems(postmortemData, filterCriteria);
  }
  
  function filterPostmortems(data: typeof postmortemData, criteria: typeof filterCriteria) {
    let filtered = [...data];
    
    // Filter by search term
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      filtered = filtered.filter(incident => 
        incident.title.toLowerCase().includes(term) ||
        incident.impact.toLowerCase().includes(term) ||
        incident.summary.toLowerCase().includes(term) ||
        incident.rootCause.toLowerCase().includes(term) ||
        incident.affectedSystems.some(system => system.toLowerCase().includes(term))
      );
    }
    
    // Filter by severity
    if (criteria.selectedSeverity !== 'all') {
      filtered = filtered.filter(incident => incident.severity === criteria.selectedSeverity);
    }
    
    // Filter by timeframe
    if (criteria.selectedTimeframe !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (criteria.selectedTimeframe) {
        case '7d':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          cutoffDate.setDate(now.getDate() - 90);
          break;
        case '1y':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(incident => new Date(incident.date) >= cutoffDate);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (criteria.sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'severity':
          const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
          aValue = severityOrder[a.severity];
          bValue = severityOrder[b.severity];
          break;
        case 'duration':
          aValue = parseDuration(a.duration);
          bValue = parseDuration(b.duration);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (criteria.sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });
    
    return filtered;
  }
  
  function parseDuration(duration: string): number {
    const match = duration.match(/(\d+)h?\s*(\d+)?m?/);
    if (!match) return 0;
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 60 + minutes;
  }
  
  // Function to load real incident.io data
  async function loadRealData() {
    if (isLoadingRealData) return;
    
    isLoadingRealData = true;
    try {
      const dashboardData = await fetchDashboardData('30d');
      dynamicKpiData = dashboardData.kpiData;
      lastUpdated = dashboardData.lastUpdated;
      apiStatus = dashboardData.apiStatus;
      useRealData = dashboardData.isLive;
      
      console.log('✅ Real incident.io data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load real data:', error);
      apiStatus = 'error';
    } finally {
      isLoadingRealData = false;
    }
  }
  
  // Function to refresh data
  async function handleRefresh() {
    await loadRealData();
  }
  
  onMount(async () => {
    const handleScroll = () => scrollY = window.scrollY;
    window.addEventListener('scroll', handleScroll);
    contentStore.load(); // Load saved content
    
    // Initialize incident.io integration
    initializeIncidentIo();
    
    // Load real data after a short delay to ensure client is initialized
    setTimeout(loadRealData, 1000);
    
    // Set up periodic refresh (every 5 minutes)
    const refreshInterval = setInterval(loadRealData, 5 * 60 * 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(refreshInterval);
    };
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
      <p class="text-gray-400">{dynamicTeamStats.size}</p>
    </div>
    <div class="card text-center">
      <div class="text-3xl mb-4">⏰</div>
      <h3 class="text-xl font-semibold mb-2">Coverage</h3>
      <p class="text-gray-400">{dynamicTeamStats.coverage}</p>
    </div>
    <div class="card text-center">
      <div class="text-3xl mb-4">🌍</div>
      <h3 class="text-xl font-semibold mb-2">Global Reach</h3>
      <p class="text-gray-400">{dynamicTeamStats.regions.length} Regions</p>
    </div>
    <div class="card text-center">
      <div class="text-3xl mb-4">🔧</div>
      <h3 class="text-xl font-semibold mb-2">Specialties</h3>
      <p class="text-gray-400">{dynamicTeamStats.specialties.length} Areas</p>
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
    
    <!-- Data Status Indicator -->
    <div class="mt-6 flex justify-center items-center space-x-4">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 rounded-full {apiStatus === 'healthy' ? 'bg-green-500 animate-pulse' : apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}"></div>
        <span class="text-sm text-gray-400">
          {#if useRealData}
            <span class="text-green-400">Live incident.io data</span>
          {:else if apiStatus === 'error'}
            <span class="text-red-400">Using fallback data</span>
          {:else}
            <span class="text-yellow-400">Connecting...</span>
          {/if}
        </span>
      </div>
      
      {#if lastUpdated}
        <div class="text-xs text-gray-500">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
        </div>
      {/if}
      
      <button 
        on:click={handleRefresh}
        disabled={isLoadingRealData}
        class="text-xs px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 disabled:opacity-50"
        title="Refresh data"
      >
        {#if isLoadingRealData}⟳{:else}🔄{/if}
      </button>
    </div>
  </div>
  
  <!-- KPI Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
    <KPICard 
      title="MTTA" 
      value={dynamicKpiData.mtta.value}
      subtitle={dynamicKpiData.mtta.subtitle}
      trend={dynamicKpiData.mtta.trend}
      trendValue={dynamicKpiData.mtta.trendValue}
      icon="⚡"
      gradient="primary"
    />
    <KPICard 
      title="MTTR" 
      value={dynamicKpiData.mttr.value}
      subtitle={dynamicKpiData.mttr.subtitle}
      trend={dynamicKpiData.mttr.trend}
      trendValue={dynamicKpiData.mttr.trendValue}
      icon="🔧"
      gradient="secondary"
    />
    <KPICard 
      title="Incidents" 
      value={dynamicKpiData.incidentCount.value}
      subtitle={dynamicKpiData.incidentCount.subtitle}
      trend={dynamicKpiData.incidentCount.trend}
      trendValue={dynamicKpiData.incidentCount.trendValue}
      icon="📊"
      gradient="tertiary"
    />
    <KPICard 
      title="Coverage" 
      value={dynamicKpiData.coverage.value}
      subtitle={dynamicKpiData.coverage.subtitle}
      trend={dynamicKpiData.coverage.trend}
      trendValue={dynamicKpiData.coverage.trendValue}
      icon="🌍"
      gradient="primary"
    />
    <KPICard 
      title="Uptime" 
      value={dynamicKpiData.uptime.value}
      subtitle={dynamicKpiData.uptime.subtitle}
      trend={dynamicKpiData.uptime.trend}
      trendValue={dynamicKpiData.uptime.trendValue}
      icon="✅"
      gradient="secondary"
    />
  </div>
  
  <!-- Charts -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="card">
      <h3 class="text-xl font-semibold mb-4 text-white">Incident Trends</h3>
      <Chart 
        type="line" 
        data={chartData.incidentTrend} 
        height={300} 
        title="Incident Trends"
        showFilters={true}
        filterable={true}
      />
    </div>
    <div class="card">
      <h3 class="text-xl font-semibold mb-4 text-white">Proactive vs Reactive</h3>
      <Chart 
        type="doughnut" 
        data={chartData.proactiveVsReactive} 
        height={300} 
        title="Proactive vs Reactive Response"
        showFilters={true}
        filterable={true}
      />
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
  
  <PostmortemFilter on:filter={handlePostmortemFilter} />
  
  <div class="space-y-6">
    {#if filteredPostmortems.length > 0}
      {#each filteredPostmortems as incident}
        <PostmortemCard {incident} {searchTerm} />
      {/each}
    {:else}
      <div class="text-center py-12">
        <div class="text-gray-400 text-lg mb-4">No postmortems found</div>
        <p class="text-gray-500">Try adjusting your search criteria or filters</p>
      </div>
    {/if}
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
    <ContactForm 
      title="Slack"
      description="Join our incident response channel"
      icon="💬"
      type="slack"
    />
    <ContactForm 
      title="Email"
      description="Direct email for urgent matters"
      icon="📧"
      type="email"
    />
    <ContactForm 
      title="Escalation"
      description="Emergency escalation form"
      icon="🚨"
      type="escalation"
    />
  </div>
</section>

<!-- Footer -->
<footer class="bg-gray-900 border-t border-gray-700 py-8">
  <div class="max-w-7xl mx-auto px-4 text-center">
    <div class="flex justify-center space-x-8 mb-4">
      <a href="/docs" class="text-gray-400 hover:text-white transition-colors">Documentation</a>
      <a href="/sla" class="text-gray-400 hover:text-white transition-colors">SLA</a>
      <a href="/ola" class="text-gray-400 hover:text-white transition-colors">OLA</a>
      <a href="/runbooks" class="text-gray-400 hover:text-white transition-colors">Runbooks</a>
    </div>
    <p class="text-gray-400">© 2024 Byte Incident Management Team. All rights reserved.</p>
  </div>
</footer>

<!-- Content Manager -->
<ContentManager />