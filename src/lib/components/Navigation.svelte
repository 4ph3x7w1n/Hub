<script lang="ts">
  import { onMount } from 'svelte';
  
  let activeSection = 'hero';
  let isScrolled = false;
  let mobileMenuOpen = false;
  
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
      mobileMenuOpen = false; // Close mobile menu after navigation
    }
  }
  
  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  
  function closeMobileMenu() {
    mobileMenuOpen = false;
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
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleEscape);
    };
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
        <button 
          on:click={toggleMobileMenu}
          class="text-gray-300 hover:text-white focus:outline-none p-2 rounded-md"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {#if mobileMenuOpen}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          {:else}
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu overlay -->
  {#if mobileMenuOpen}
    <div class="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" on:click={closeMobileMenu} on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()} role="button" tabindex="-1" aria-label="Close mobile menu">
      <div class="fixed top-16 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-lg">
        <div class="px-2 pt-2 pb-3 space-y-1">
          {#each sections as section}
            <button
              on:click={() => scrollToSection(section.id)}
              class="block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors {activeSection === section.id ? 'text-gradient-gold bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}"
            >
              {section.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</nav>