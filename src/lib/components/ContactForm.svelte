<script lang="ts">
  export let title: string;
  export let description: string;
  export let icon: string;
  export let type: 'slack' | 'email' | 'escalation' = 'email';
  
  let isOpen = false;
  let formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  };
  
  let isSubmitting = false;
  let submitted = false;
  let errors: Record<string, string> = {};
  
  function openForm() {
    isOpen = true;
    resetForm();
  }
  
  function closeForm() {
    isOpen = false;
    resetForm();
  }
  
  function resetForm() {
    formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium'
    };
    errors = {};
    submitted = false;
  }
  
  function validateForm() {
    errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return Object.keys(errors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validateForm()) return;
    
    isSubmitting = true;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Form submitted:', { type, ...formData });
      
      submitted = true;
      setTimeout(() => {
        closeForm();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      errors.submit = 'Failed to submit form. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeForm();
    }
  }
  
  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="card text-center">
  <div class="text-4xl mb-4">{icon}</div>
  <h3 class="text-xl font-semibold mb-2 text-white">{title}</h3>
  <p class="text-gray-400 mb-4">{description}</p>
  <button class="btn-primary" on:click={openForm}>
    {type === 'slack' ? 'Join Channel' : type === 'email' ? 'Send Email' : 'Submit Request'}
  </button>
</div>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div class="card max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-white">{title}</h2>
        <button 
          on:click={closeForm}
          class="text-gray-400 hover:text-white"
          aria-label="Close form"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {#if submitted}
        <div class="text-center py-8">
          <div class="text-green-500 text-5xl mb-4">✓</div>
          <h3 class="text-xl font-semibold text-white mb-2">Message Sent!</h3>
          <p class="text-gray-300">We'll get back to you shortly.</p>
        </div>
      {:else}
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
              placeholder="Your name"
              class:border-red-500={errors.name}
            />
            {#if errors.name}
              <p class="mt-1 text-sm text-red-400">{errors.name}</p>
            {/if}
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
              placeholder="your.email@company.com"
              class:border-red-500={errors.email}
            />
            {#if errors.email}
              <p class="mt-1 text-sm text-red-400">{errors.email}</p>
            {/if}
          </div>
          
          {#if type === 'escalation'}
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                id="priority"
                bind:value={formData.priority}
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <div class="mt-2 flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full {priorityColors[formData.priority]}"></div>
                <span class="text-sm text-gray-300 capitalize">{formData.priority} Priority</span>
              </div>
            </div>
          {/if}
          
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <input
              id="subject"
              type="text"
              bind:value={formData.subject}
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent"
              placeholder={type === 'escalation' ? 'Brief description of the incident' : 'What can we help you with?'}
              class:border-red-500={errors.subject}
            />
            {#if errors.subject}
              <p class="mt-1 text-sm text-red-400">{errors.subject}</p>
            {/if}
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-gray-300 mb-2">Message</label>
            <textarea
              id="message"
              bind:value={formData.message}
              rows="4"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gradient-gold focus:border-transparent resize-none"
              placeholder={type === 'escalation' ? 'Please provide detailed information about the incident, impact, and any steps already taken...' : 'Tell us more about your request...'}
              class:border-red-500={errors.message}
            ></textarea>
            {#if errors.message}
              <p class="mt-1 text-sm text-red-400">{errors.message}</p>
            {/if}
          </div>
          
          {#if errors.submit}
            <div class="text-red-400 text-sm">{errors.submit}</div>
          {/if}
          
          <div class="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {#if isSubmitting}
                <span class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              {:else}
                Send Message
              {/if}
            </button>
            <button
              type="button"
              on:click={closeForm}
              class="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
{/if}