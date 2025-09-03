import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomMonitorService {
  private isMonitoring = false;

  constructor() {
    console.log('🖥️ DomMonitorService initialized');
    this.startMonitoring();
  }

  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    console.log('👀 Starting DOM monitoring...');
    this.isMonitoring = true;

    // Monitor DOM ready state
    this.monitorDOMReady();
    
    // Monitor clicks
    this.monitorClicks();
    
    // Monitor form submissions
    this.monitorForms();
    
    // Monitor route changes
    this.monitorRouteChanges();
  }

  private monitorDOMReady(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ DOM Content Loaded');
        this.logDOMStats();
      });
    } else {
      console.log('✅ DOM Already Ready');
      this.logDOMStats();
    }

    window.addEventListener('load', () => {
      console.log('✅ Window Fully Loaded');
      this.logDOMStats();
    });
  }

  private monitorClicks(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      
      console.log('🖱️ Click detected:', {
        tag: tagName,
        class: className,
        id: id,
        text: target.textContent?.substring(0, 50) || '',
        timestamp: new Date().toISOString()
      });

      // Special logging for buttons and links
      if (tagName === 'button' || tagName === 'a') {
        console.log('🎯 Interactive element clicked:', {
          type: tagName,
          text: target.textContent?.trim(),
          href: tagName === 'a' ? (target as HTMLAnchorElement).href : null
        });
      }
    });
  }

  private monitorForms(): void {
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      console.log('📝 Form submission detected:', {
        action: form.action,
        method: form.method,
        elements: form.elements.length,
        timestamp: new Date().toISOString()
      });
    });

    document.addEventListener('input', (event) => {
      const input = event.target as HTMLInputElement;
      if (input.type !== 'password') { // Don't log password inputs
        console.log('⌨️ Input change:', {
          name: input.name,
          type: input.type,
          value: input.value.substring(0, 20) + (input.value.length > 20 ? '...' : ''),
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  private monitorRouteChanges(): void {
    // Monitor URL changes
    let currentUrl = window.location.href;
    
    const checkUrlChange = () => {
      if (window.location.href !== currentUrl) {
        console.log('🧭 Route changed:', {
          from: currentUrl,
          to: window.location.href,
          timestamp: new Date().toISOString()
        });
        currentUrl = window.location.href;
        
        // Log new page stats after route change
        setTimeout(() => this.logDOMStats(), 100);
      }
    };

    // Check for URL changes periodically
    setInterval(checkUrlChange, 1000);
    
    // Also listen to popstate events
    window.addEventListener('popstate', checkUrlChange);
  }

  private logDOMStats(): void {
    const stats = {
      totalElements: document.querySelectorAll('*').length,
      buttons: document.querySelectorAll('button').length,
      links: document.querySelectorAll('a').length,
      forms: document.querySelectorAll('form').length,
      inputs: document.querySelectorAll('input').length,
      images: document.querySelectorAll('img').length,
      scripts: document.querySelectorAll('script').length,
      stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
      currentUrl: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };

    console.log('📊 DOM Statistics:', stats);
  }

  logComponentLoad(componentName: string): void {
    console.log(`🧩 Component loaded: ${componentName}`, {
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  logApiCall(method: string, url: string, status: 'start' | 'success' | 'error', data?: any): void {
    const emoji = status === 'start' ? '🚀' : status === 'success' ? '✅' : '❌';
    console.log(`${emoji} API ${method.toUpperCase()} ${status}:`, {
      url,
      data: data ? (typeof data === 'object' ? JSON.stringify(data).substring(0, 100) : data) : null,
      timestamp: new Date().toISOString()
    });
  }

  stopMonitoring(): void {
    console.log('🛑 Stopping DOM monitoring');
    this.isMonitoring = false;
  }
}