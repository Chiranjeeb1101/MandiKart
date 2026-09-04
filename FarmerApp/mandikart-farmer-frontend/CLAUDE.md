# Claude Agent Instructions

## 🔧 Coding Standards & Project Structure

### File Naming Conventions
- **Components**: PascalCase (`MyComponent.tsx`, `UserAvatar.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useForm.ts`)
- **Screens**: PascalCase in `screens/` directory (`HomeScreen.tsx`)
- **Services**: camelCase (`apiService.ts`, `mockData.ts`)
- **Helpers**: camelCase (`formatters.ts`, `validators.ts`)
- **Constants**: UPPER_SNAKE_CASE (`COLORS.ts`, `API_ENDPOINTS.ts`)

### Directory Structure
```
src/
├── components/        # Reusable UI components
│   ├── common/        # Generic components (Button, Input, Modal)
│   ├── layout/        # Layout components (Header, Footer, Sidebar)
│   └── feature/       # Feature-specific components
├── constants/         # App constants and configuration
├── hooks/             # Custom React hooks
├── navigation/        # Navigation setup (router config, navigators)
├── screens/           # App screens (grouped by feature if large)
├── services/          # API services and data fetching
│   ├── api/           # API client and endpoints
│   └── mock/          # Mock data for development
├── store/             # State management (if using Redux/Zustand)
├── theme/             # Theming (colors, typography, spacing)
├── utils/             # Utility functions (formatters, validators)
└── types/             # TypeScript type definitions
```

### Component Best Practices
1. **Functional Components**: Always use functional components with hooks
2. **Type Safety**: Use TypeScript with strict type checking
3. **Props Destructuring**: Destructure props for cleaner code
4. **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` where needed
5. **Accessibility**: Include `accessibilityLabel` and other ARIA props

## 🚀 Development Workflow

### Branch Naming Conventions
- **Feature branches**: `feat/feature-name` (e.g., `feat/user-authentication`)
- **Bugfix branches**: `fix/bug-description` (e.g., `fix/login-error-handling`)
- **Hotfix branches**: `hotfix/issue-summary`
- **Documentation**: `docs/what-needs-to-be-documented`

### Pull Request Guidelines
1. **PR Title**: Clear and concise title (max 50 characters)
2. **PR Description**: Detailed explanation of changes, motivation, and testing performed
3. **Screenshots**: Include screenshots/GIFs for UI changes
4. **Testing**: Mention how the changes were tested
5. **Related Issues**: Link to relevant issues using `Fixes #123` or `Closes #123`
6. **Checklist**: Complete the PR template checklist

### Commit Message Format
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scope**: Optional, e.g., `(api)`, `(ui)`, `(auth)`

**Examples**:
```
feat(auth): add user registration endpoint

Implements the new /api/auth/register endpoint with validation
and token generation.

Fixes #45
```

## 🧪 Testing Guidelines

### Unit Testing
- **Framework**: Vitest or Jest (based on project setup)
- **Location**: `src/__tests__/` or `src/components/__tests__/`
- **Patterns**:
  - Test one thing at a time
  - Use descriptive test names
  - Test edge cases and error conditions

### Integration Testing
- Test component interactions
- Use React Testing Library for component testing
- Test API integrations with mock data

### E2E Testing
- Use Detox or Appium for end-to-end tests
- Test critical user flows
- Run tests in CI/CD pipeline

## 🎨 Design System

### Color Palette
- **Primary**: `#007bff` - Main brand color
- **Secondary**: `#6c757d` - Secondary actions
- **Success**: `#28a745` - Success states
- **Warning**: `#ffc107` - Warning states
- **Danger**: `#dc3545` - Error states

### Typography
- **Base**: Roboto
- **Font Sizes**: 12px, 14px, 16px, 20px, 24px, 32px, 40px
- **Weights**: 400, 500, 600, 700

### Spacing
- Use multiples of 4px (4, 8, 12, 16, 20, 24, 32, 40...)
- Use CSS custom properties for consistent spacing

## 📝 Code Documentation

### JSDoc Comments
- Document all public APIs (components, hooks, services)
- Use `@param`, `@returns`, `@throws`, `@example`
- Keep documentation up-to-date with code changes

### Component Documentation
- Document each component in its own file
- Include usage examples
- List all props and their types
- Document any accessibility considerations

## 🔐 Security Best Practices

### API Security
- Use HTTPS for all API communication
- Implement proper authentication and authorization
- Use JWT tokens with short expiry
- Implement rate limiting on sensitive endpoints
- Sanitize all user inputs

### Data Privacy
- Comply with GDPR and other privacy regulations
- Encrypt sensitive data at rest and in transit
- Implement proper data retention policies
- Provide user control over their data

### Dependency Security
- Regularly update dependencies
- Use `npm audit` or `yarn audit` to check for vulnerabilities
- Pin dependencies to specific versions where needed

## 📈 Performance Optimization

### UI Performance
- Use `React.memo`, `useMemo`, `useCallback` to prevent unnecessary re-renders
- Implement lazy loading for large components
- Use virtualization for long lists
- Optimize image sizes and formats

### API Performance
- Use caching for frequently accessed data
- Implement pagination for large datasets
- Use GraphQL for flexible data fetching
- Implement proper error handling and fallback mechanisms

### Bundle Optimization
- Code splitting for large applications
- Tree shaking to remove unused code
- Lazy load non-critical assets
- Optimize build configuration

## 🤝 Collaboration Guidelines

### Code Review Process
1. **Self-Review**: Review your own code before submitting PR
2. **Peer Review**: Get feedback from at least one other developer
3. **Review Focus**:
   - Correctness: Does the code work as expected?
   - Readability: Is the code easy to understand?
   - Maintainability: Is the code easy to modify?
   - Performance: Are there any performance issues?
   - Security: Are there any security vulnerabilities?
   - Best Practices: Does the code follow established patterns?

### Handling Conflicts
1. **Communicate**: Talk to the other developer if possible
2. **Resolve Incrementally**: Fix conflicts one at a time
3. **Test**: Test thoroughly after resolving conflicts
4. **Update**: Update PR description with any issues encountered

### Handling Blockers
1. **Communicate Early**: Don't wait to mention blockers
2. **Provide Context**: Explain what's blocked and why
3. **Suggest Solutions**: Propose alternative approaches if possible
4. **Escalate Appropriately**: Ask for help from seniors or leads if needed
