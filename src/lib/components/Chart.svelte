<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart as ChartJS, registerables } from 'chart.js';
  
  export let type: 'line' | 'bar' | 'doughnut' = 'line';
  export let data: any;
  export let options: any = {};
  export let height: number = 400;
  export let width: number = 800;
  export let title: string = '';
  export let showFilters: boolean = false;
  export let filterable: boolean = false;
  
  let canvas: HTMLCanvasElement;
  let chart: ChartJS;
  let originalData: any;
  let selectedTimeRange: string = '12m';
  let selectedDatasets: string[] = [];
  let isFullscreen: boolean = false;
  
  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '12m', label: '12 Months' }
  ];
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#f9fafb',
        bodyColor: '#f3f4f6',
        borderColor: '#6b7280',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context: any) {
            return context[0].label;
          },
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            if (type === 'line' && context.dataset.label) {
              label += context.dataset.label.includes('Time') ? ' min' : ' incidents';
            }
            return label;
          }
        }
      }
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      y: {
        grid: {
          color: '#374151'
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    } : undefined,
    onClick: (event: any, elements: any) => {
      if (elements.length > 0 && filterable) {
        const dataIndex = elements[0].index;
        const datasetIndex = elements[0].datasetIndex;
        console.log('Chart clicked:', { dataIndex, datasetIndex, data: data.datasets[datasetIndex].data[dataIndex] });
      }
    },
    onHover: (event: any, elements: any) => {
      canvas.style.cursor = elements.length > 0 && filterable ? 'pointer' : 'default';
    }
  };
  
  onMount(() => {
    ChartJS.register(...registerables);
    originalData = JSON.parse(JSON.stringify(data));
    
    if (data.datasets) {
      selectedDatasets = data.datasets.map((dataset: any) => dataset.label);
    }
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      chart = new ChartJS(ctx, {
        type,
        data,
        options: { ...defaultOptions, ...options }
      });
    }
    
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  });
  
  // Update chart when data changes
  $: if (chart && data) {
    chart.data = data;
    chart.update();
  }
  
  function toggleDataset(datasetLabel: string) {
    if (selectedDatasets.includes(datasetLabel)) {
      selectedDatasets = selectedDatasets.filter(label => label !== datasetLabel);
    } else {
      selectedDatasets = [...selectedDatasets, datasetLabel];
    }
    
    updateChartData();
  }
  
  function updateChartData() {
    if (!chart || !originalData) return;
    
    const filteredData = {
      ...originalData,
      datasets: originalData.datasets.filter((dataset: any) => 
        selectedDatasets.includes(dataset.label)
      )
    };
    
    chart.data = filteredData;
    chart.update();
  }
  
  function handleTimeRangeChange() {
    // In a real app, this would fetch new data based on the time range
    console.log('Time range changed to:', selectedTimeRange);
    // For now, just update the chart with the same data
    if (chart) {
      chart.update();
    }
  }
  
  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
  }
  
  function exportChart() {
    if (chart) {
      const url = chart.toBase64Image();
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'chart'}.png`;
      a.click();
    }
  }
</script>

<div class="chart-wrapper {isFullscreen ? 'fullscreen' : ''}">
  {#if showFilters}
    <div class="chart-controls">
      <div class="controls-left">
        <select bind:value={selectedTimeRange} on:change={handleTimeRangeChange} class="time-range-select">
          {#each timeRanges as range}
            <option value={range.value}>{range.label}</option>
          {/each}
        </select>
      </div>
      
      <div class="controls-right">
        <button on:click={exportChart} class="control-btn" title="Export chart" aria-label="Export chart">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <button on:click={toggleFullscreen} class="control-btn" title="Toggle fullscreen" aria-label="Toggle fullscreen">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </div>
  {/if}
  
  <div class="chart-container" style="height: {height}px; width: {width}px; max-width: 100%;">
    <canvas bind:this={canvas}></canvas>
  </div>
  
  {#if originalData && originalData.datasets && showFilters}
    <div class="dataset-filters">
      <span class="filter-label">Show:</span>
      {#each originalData.datasets as dataset}
        <button 
          class="dataset-toggle {selectedDatasets.includes(dataset.label) ? 'active' : ''}"
          on:click={() => toggleDataset(dataset.label)}
          style="--dataset-color: {dataset.borderColor || dataset.backgroundColor}"
        >
          <span class="dataset-indicator"></span>
          {dataset.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

{#if isFullscreen}
  <div class="fullscreen-overlay" on:click={toggleFullscreen} on:keydown={(e) => e.key === 'Escape' && toggleFullscreen()} role="button" tabindex="0" aria-label="Close fullscreen">
    <div class="fullscreen-content" on:click|stopPropagation>
      <div class="fullscreen-header">
        <h3 class="text-xl font-semibold text-white">{title}</h3>
        <button on:click={toggleFullscreen} class="control-btn" aria-label="Close fullscreen">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="fullscreen-chart">
        <canvas bind:this={canvas}></canvas>
      </div>
    </div>
  </div>
{/if}

<style>
  .chart-wrapper {
    position: relative;
  }
  
  .chart-container {
    position: relative;
    background: rgba(17, 24, 39, 0.5);
    border-radius: 0.75rem;
    padding: 1rem;
  }
  
  .chart-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(31, 41, 55, 0.5);
    border-radius: 0.5rem;
  }
  
  .controls-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .controls-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .time-range-select {
    background: rgba(55, 65, 81, 0.8);
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    color: white;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  .control-btn {
    background: rgba(55, 65, 81, 0.8);
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    color: #9ca3af;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .control-btn:hover {
    background: rgba(75, 85, 99, 0.8);
    color: white;
  }
  
  .dataset-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(31, 41, 55, 0.3);
    border-radius: 0.5rem;
  }
  
  .filter-label {
    font-size: 0.875rem;
    color: #9ca3af;
    margin-right: 0.5rem;
  }
  
  .dataset-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(55, 65, 81, 0.5);
    border: 1px solid #4b5563;
    border-radius: 0.375rem;
    color: #9ca3af;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .dataset-toggle:hover {
    background: rgba(75, 85, 99, 0.5);
    color: white;
  }
  
  .dataset-toggle.active {
    background: rgba(75, 85, 99, 0.8);
    color: white;
    border-color: var(--dataset-color);
  }
  
  .dataset-indicator {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: var(--dataset-color);
    opacity: 0.7;
  }
  
  .dataset-toggle.active .dataset-indicator {
    opacity: 1;
  }
  
  .fullscreen-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .fullscreen-content {
    background: #1f2937;
    border-radius: 0.75rem;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .fullscreen-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #374151;
  }
  
  .fullscreen-chart {
    flex: 1;
    padding: 1rem;
    position: relative;
  }
  
  .fullscreen-chart canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>