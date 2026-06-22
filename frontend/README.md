# Modern Responsive Navigation Bar - React

A modern, responsive navigation bar built with React and CSS. This project demonstrates a clean, professional navbar design with smooth animations and mobile responsiveness.

## Features

### Design Elements
- **Logo**: 📚 book icon with "LearnStyle" text in bold purple (#a855f7)
- **Navigation Links**: Home (active), About Us, Contact Us
- **Buttons**: Admin Login (white background) and User Login (purple gradient)
- **Responsive Design**: Fully responsive for mobile and desktop views

### Interactive Features
- **Hover Effects**: Purple underline on navigation links, subtle shadows on buttons
- **Mobile Menu**: Hamburger menu for mobile devices with smooth animations
- **Active States**: Visual indicators for current page
- **Smooth Transitions**: All interactions have smooth animations

### Technical Features
- Built with React 18
- Pure CSS styling (no Tailwind CSS)
- Flexbox layout
- Mobile-first responsive design
- Accessibility features (focus states, ARIA labels)

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this project
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
 npm start
```

The application will open in your browser at `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Main navigation component
│   └── Navbar.css         # Navigation styles
├── App.js                 # Main app component
├── App.css               # App styles
├── index.js              # React entry point
└── index.css             # Global styles
```

## CSS Features

### Modern Design Principles
- Clean, minimal design
- Proper spacing and typography
- Consistent color scheme
- Smooth animations and transitions

### Responsive Breakpoints
- **Desktop**: Full navigation with all elements visible
- **Tablet (≤768px)**: Hamburger menu with dropdown
- **Mobile (≤480px)**: Optimized for small screens

### Color Scheme
- **Primary Purple**: #a855f7
- **Text Colors**: #1f2937 (dark), #6b7280 (gray)
- **Background**: White with subtle shadows
- **Gradients**: Purple gradient for user login button

## Customization

The navigation bar is easily customizable:

1. **Colors**: Modify the CSS variables in `Navbar.css`
2. **Logo**: Change the emoji and text in `Navbar.js`
3. **Links**: Add or remove navigation links
4. **Buttons**: Customize button styles and text

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License. 