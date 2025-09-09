# Animation Components

This directory contains custom animation components using the `motion` library for smooth, interactive animations.

## Components

### BlurText

An animated text component that reveals text with a blur effect, word by word or character by character.

**Props:**
- `text` (string): The text to animate
- `delay` (number): Delay between each element animation (default: 200ms)
- `animateBy` ('words' | 'characters'): Animation granularity (default: 'words')
- `direction` ('top' | 'bottom'): Animation direction (default: 'top')
- `className` (string): Additional CSS classes
- `onAnimationComplete` (function): Callback when animation completes
- `stepDuration` (number): Duration of each animation step (default: 0.35s)

**Usage:**
```tsx
import BlurText from '@/components/BlurText';

<BlurText
  text="Welcome to our amazing platform!"
  delay={150}
  animateBy="words"
  direction="top"
  className="text-2xl font-bold"
  onAnimationComplete={() => console.log('Done!')}
/>
```

### LoadingScreen

A full-screen loading component that combines your logo, BlurText animation, and loading indicators.

**Props:**
- `onLoadingComplete` (function): Callback when loading animation completes
- `loadingText` (string): Text to display (default: "Welcome to Pesticide Control System")
- `buttonText` (string): Text for the "Go to Homepage" button (default: "Go to Homepage")
- `className` (string): Additional CSS classes for customization

**Features:**
- Animated logo entrance
- BlurText for dynamic text reveal
- "Go to Homepage" button with smooth animations
- Pulsing loading dots
- Animated progress bar
- Dark mode support
- Responsive design

**Usage:**
```tsx
import LoadingScreen from '@/components/LoadingScreen';

const [isLoading, setIsLoading] = useState(true);

return (
  <>
    {isLoading && (
      <LoadingScreen
        onLoadingComplete={() => setIsLoading(false)}
        loadingText="Initializing your dashboard"
        buttonText="Enter Dashboard"
      />
    )}
    {!isLoading && (
      <YourMainContent />
    )}
  </>
);
```

## Installation

The components require the following dependencies:

```bash
npm install motion
```

Note: `framer-motion` is also installed but we're using the newer `motion` package for these components.

## Styling

The components use Tailwind CSS classes and support dark mode. Make sure your Tailwind configuration includes:

- Dark mode support
- Required opacity, blur, and transform utilities
- Animation and transition utilities

## TypeScript

Both components are fully typed with TypeScript interfaces for better developer experience and type safety.

## Examples

Check `LoadingScreen.example.tsx` for comprehensive usage examples including:
- Basic loading screen implementation
- Custom text and styling
- Standalone BlurText usage
- App-wide loading patterns

## Browser Compatibility

The components use modern CSS features like `will-change` and CSS filters. They work well in all modern browsers and gracefully degrade in older browsers.
