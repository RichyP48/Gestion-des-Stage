import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  standalone: true,
  template: `
    <div class="w-full h-screen bg-green-500 flex items-center justify-center">
      <h1 class="text-6xl font-bold text-white">TEST COMPONENT WORKS!</h1>
    </div>
  `
})
export class TestComponent { }