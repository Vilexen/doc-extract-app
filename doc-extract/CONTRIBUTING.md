# Contributing to Invoice Extraction Platform

Thank you for considering contributing to the Invoice Extraction Platform! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

Before submitting a bug report, please check if it has already been reported by searching the issue tracker.

When you are creating a bug report, please include as much detail as possible:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots or screen recordings if applicable
- Your environment (browser version, OS, etc.)
- Any relevant logs or error messages

### Suggesting Features

We welcome feature suggestions! When suggesting a feature, please include:
- A clear and descriptive title
- A detailed description of the feature and its benefits
- Any potential drawbacks or considerations
- Examples of how the feature would be used
- Priority level (low, medium, high)

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bug fix (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure your code follows the project's coding standards
5. Add or update tests as needed
6. Make sure all tests pass
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## Development Setup

### Prerequisites
- Node.js >= 16.x
- MongoDB >= 5.0
- Redis >= 6.0
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/invoice-extraction-platform.git
cd invoice-extraction-platform/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm start
```

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test
```

## Code Style

### JavaScript/TypeScript
- Follow the Airbnb JavaScript Style Guide
- Use ESLint for linting
- Use Prettier for code formatting
- Meaningful variable and function names
- Comment complex logic
- Keep functions small and focused

### Git Commit Messages
- Use the conventional commits format
- Examples:
  - `feat: add user authentication`
  - `fix: resolve invoice calculation error`
  - `docs: update API documentation`
  - `style: fix indentation`
  - `refactor: simplify validation logic`
  - `test: add unit tests for upload service`
  - `chore: update dependencies`

## Licensing

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Getting Help

If you need help with your contribution, please:
1. Check the documentation
2. Look at existing issues and pull requests
3. Ask for help in the issue tracker

Thank you again for contributing to the Invoice Extraction Platform!