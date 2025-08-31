# Elegance - Ecommerce Frontend

A modern, professional React.js frontend for the MERN stack ecommerce application specializing in women's and kids' clothing.

## Features

- **Modern Design**: Professional, responsive UI with Tailwind CSS
- **Authentication**: Complete user authentication with JWT tokens
- **Shopping Cart**: Real-time cart management with context API
- **Product Catalog**: Beautiful product listings with filtering and search
- **Responsive Design**: Mobile-first approach with elegant animations
- **Payment Integration**: Stripe payment processing (ready for integration)
- **Admin Panel**: Admin interface for product and order management
- **Performance**: Optimized with React best practices and lazy loading

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API + useReducer
- **HTTP Client**: Axios with interceptors for token management
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Heroicons + React Icons
- **Notifications**: React Hot Toast
- **Forms**: Custom form handling with validation
- **Payments**: Stripe Elements (ready for integration)

## Quick Start

### Prerequisites

- Node.js 16+
- Backend API running on port 5000

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   
   App runs on `http://localhost:3000`

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (LoadingSpinner, etc.)
│   ├── layout/          # Layout components (Header, Footer, Layout)
│   ├── product/         # Product-related components
│   ├── cart/            # Shopping cart components
│   ├── auth/            # Authentication components
│   └── admin/           # Admin panel components
├── pages/               # Page components
├── context/             # React Context providers
├── services/            # API services and HTTP client
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # Global styles and Tailwind config
```

## Design System

### Colors
- **Primary**: Pink/Rose tones for branding and CTAs
- **Secondary**: Gray scale for text and backgrounds
- **Accent**: Success, warning, error states

### Typography
- **Display Font**: Playfair Display (headings)
- **Body Font**: Inter (body text)
- **Font Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Product cards, info cards with hover effects
- **Forms**: Consistent input styling with validation states
- **Navigation**: Multi-level navigation with mobile menu

## Key Features

### Authentication System
- JWT token management with automatic refresh
- Persistent login state across browser sessions
- Role-based access control (user/admin)
- Protected routes and conditional rendering

### Shopping Cart
- Real-time cart updates with context API
- Persistent cart state for authenticated users
- Stock validation and error handling
- Smooth animations for cart interactions

### Product Catalog
- Advanced filtering and search capabilities
- Product variants (size, color) with stock tracking
- Wishlist functionality
- Product image galleries with zoom

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Optimized images and lazy loading

## API Integration

### Authentication Flow
1. User logs in → receives access token
2. Token stored in memory (not localStorage for security)
3. Refresh token stored as httpOnly cookie
4. Automatic token refresh on expiration
5. Logout clears all tokens

### Error Handling
- Global error interceptor for API calls
- User-friendly error messages
- Automatic retry for failed requests
- Fallback UI for error states

## Performance Optimizations

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Size**: Tree shaking and dependency optimization
- **Caching**: SWR for data fetching and caching
- **Animations**: Hardware-accelerated CSS animations

## Development Guidelines

### Component Structure
```tsx
// Component with proper TypeScript interfaces
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div className="component-styles">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

### Styling Conventions
- Use Tailwind utility classes
- Custom components in `@layer components`
- Consistent spacing with Tailwind scale
- Hover and focus states for all interactive elements

### State Management
- Use Context API for global state (auth, cart)
- Local state with useState for component-specific data
- useReducer for complex state logic
- Custom hooks for reusable stateful logic

## Testing (To Be Added)

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API integration testing
- **E2E Tests**: Cypress for critical user flows
- **Visual Tests**: Storybook for component documentation

## Deployment

### Build for Production
```bash
npm run build
```

### Deployment Platforms
- **Vercel**: Recommended for React apps
- **Netlify**: Alternative with good React support
- **AWS S3 + CloudFront**: For enterprise deployments

### Environment Variables
Ensure all production environment variables are set:
- `REACT_APP_API_URL`: Production API URL
- `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Production Stripe key

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2020, CSS Grid, Flexbox, CSS Custom Properties

## Contributing

1. Follow the established code style and conventions
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure responsive design works across devices

## Future Enhancements

- [ ] Progressive Web App (PWA) features
- [ ] Advanced search with filters
- [ ] Product reviews and ratings
- [ ] Social login integration
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced analytics integration
- [ ] Real-time notifications

## Support

For development questions or issues:
1. Check the component documentation
2. Review the API integration guide
3. Test with the backend API endpoints
4. Ensure all environment variables are configured