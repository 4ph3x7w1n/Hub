<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart as ChartJS, registerables } from 'chart.js';
  
  export let type: 'line' | 'bar' | 'doughnut' = 'line';
  export let data: any;
  export let options: any = {};
  export let height: number = 400;
  export let width: number = 800;
  
  let canvas: HTMLCanvasElement;
  let chart: ChartJS;
  
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        }
      }
    },
    scales: {
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
    }
  };
  
  onMount(() => {
    ChartJS.register(...registerables);
    
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
</script>

<div class="chart-container" style="height: {height}px; width: {width}px; max-width: 100%;">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-container {
    position: relative;
    background: rgba(17, 24, 39, 0.5);
    border-radius: 0.75rem;
    padding: 1rem;
  }
</style>