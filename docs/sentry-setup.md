# Sentry Error Tracking - Setup Guide

This document outlines how to complete the Sentry integration setup and start tracking errors in production.

## Prerequisites

1. Create a Sentry account at [sentry.io](https://sentry.io) (free tier available)
2. Create a new **React Native** project in your Sentry dashboard
3. Copy your project's DSN (Data Source Name)

## Configuration Steps

### 1. Add Sentry DSN to Environment Variables

Add your Sentry DSN to the `.env` file:

```bash
SENTRY_DSN=https://your-actual-dsn@sentry.io/your-project-id
```

> **Note**: The `.env` file is gitignored. Never commit your DSN to version control.

### 2. Test the Integration

To verify Sentry is working:

1. **Start the development server**:
   ```bash
   pnpm start
   ```

2. **Add a test error** (temporary, for testing):
   ```typescript
   // Add this to any screen, e.g., HomeScreen.tsx
   import { captureException } from '@/lib/sentry';
   
   // Inside a button press or useEffect
   try {
     throw new Error('Test Sentry Integration');
   } catch (error) {
     captureException(error as Error, { context: 'Test Error' });
   }
   ```

3. **Trigger the error** by pressing the button or loading the screen

4. **Check your Sentry dashboard** - You should see the error appear within a few seconds

5. **Remove the test code** after verification

### 3. Production Configuration

For production builds:

1. **Update `beforeSend` in `src/lib/sentry.ts`**:
   - The current configuration doesn't send errors in development (returns `null`)
   - This is good for testing, but you can modify this behavior as needed

2. **Enable source maps** (optional but recommended):
   - For better error tracking, upload source maps to Sentry
   - This requires additional EAS Build configuration
   - See: [Sentry Source Maps Guide](https://docs.sentry.io/platforms/react-native/sourcemaps/)

## Usage Examples

### Capturing Exceptions

```typescript
import { captureException } from '@/lib/sentry';

try {
  // Your code
  await someAsyncOperation();
} catch (error) {
  captureException(error as Error, {
    operation: 'someAsyncOperation',
    userId: user.id,
  });
}
```

### Capturing Messages

```typescript
import { captureMessage } from '@/lib/sentry';

captureMessage('User completed onboarding', 'info', {
  userId: user.id,
  timestamp: new Date().toISOString(),
});
```

### Setting User Context

```typescript
import { setUser } from '@/lib/sentry';

// After user logs in
setUser({
  id: user.id,
  email: user.email,
  username: user.username,
});

// After logout
setUser(null);
```

### Adding Breadcrumbs

```typescript
import { addBreadcrumb } from '@/lib/sentry';

addBreadcrumb({
  message: 'User navigated to recipe detail',
  category: 'navigation',
  level: 'info',
  data: {
    recipeId: recipe.id,
    recipeName: recipe.name,
  },
});
```

### Setting Tags and Context

```typescript
import { setTag, setContext } from '@/lib/sentry';

// Set tags for filtering in Sentry dashboard
setTag('feature', 'authentication');
setTag('user_type', 'premium');

// Set custom context
setContext('recipe_context', {
  totalRecipes: recipes.length,
  favoriteCount: favorites.length,
});
```

## Configuration Options

All Sentry configuration is located in `src/lib/sentry.ts`. You can customize:

- **Sample rates**: Adjust `tracesSampleRate` for performance monitoring
- **Breadcrumbs**: Change `maxBreadcrumbs` or filtering logic
- **Beforehooks**: Modify `beforeSend` and `beforeBreadcrumb` to filter data
- **Integrations**: Add or remove integrations as needed

## Troubleshooting

### Errors not appearing in Sentry dashboard

1. Verify your DSN is correct in `.env`
2. Check that you've restarted the dev server after adding the DSN
3. Ensure `beforeSend` is not returning `null` in production
4. Check the console for Sentry initialization logs

### TypeScript errors

If you see type errors related to Sentry:
```bash
pnpm install --force
```

### Build errors

If you encounter build errors after adding Sentry:
1. Clear the cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`

## Additional Resources

- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Sentry Expo Integration](https://docs.expo.dev/guides/using-sentry/)
- [Performance Monitoring](https://docs.sentry.io/platforms/react-native/performance/)
