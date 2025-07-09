<script lang="ts">
  import { onMount } from 'svelte';
  
  let activeSection = 'hero';
  let isScrolled = false;
  
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'features', label: 'Features' },
    { id: 'postmortems', label: 'Analysis' },
    { id: 'contact', label: 'Contact' }
  ];
  
  function scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 50;
      
      // Find active section
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            activeSection = section.id;
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <div class="text-2xl font-bold gradient-text">BYTE LOGO</div>
      </div>
      
      <!-- Navigation Links -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-4">
          {#each sections as section}
            <button
              on:click={() => scrollToSection(section.id)}
              class="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-gradient-gold {activeSection === section.id ? 'text-gradient-gold border-b-2 border-gradient-gold' : 'text-gray-300 hover:text-white'}"
            >
              {section.label}
            </button>
          {/each}
        </div>
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button class="text-gray-300 hover:text-white focus:outline-none">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>