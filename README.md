# Kim Phu Quy Frontend

A modern e-commerce web application built with Next.js for Kim Phu Quy, showcasing silver products with advanced features including real-time price updates, cart management, and order processing.

![Kim Phu Quy Logo](/public/nls_logo_root2.png)

## 🚀 Technologies

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Yup](https://github.com/jquense/yup)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Data Export**: [SheetJS (xlsx)](https://sheetjs.com/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd kimphuquy-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## 🏃‍♂️ Development

Start the development server with Turbopack:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🔨 Build

Create a production build:

```bash
npm run build
# or
yarn build
```

## 🚀 Production

Start the production server:

```bash
npm run start
# or
yarn start
```

## 🧪 Linting

Run ESLint to check code quality:

```bash
npm run lint
# or
yarn lint
```

## 📁 Project Structure

```
/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app directory with pages and routes
│   ├── components/    # React components
│   │   ├── cart/      # Cart-related components
│   │   ├── common/    # Shared components (header, footer)
│   │   ├── home/      # Homepage components
│   │   ├── order/     # Order processing components
│   │   ├── tools/     # Utility tool components
│   │   └── ui/        # UI components
│   ├── data/          # Data files and models
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and services
│   └── styles/        # Global styles
└── ...config files    # Various configuration files
```

## 🌟 Features

- Responsive design for all device sizes
- Dark/light mode support
- Real-time silver price updates
- Product filtering and search
- Shopping cart functionality
- Order processing and confirmation
- QR code generation tools
- Excel data export

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 👥 Contact

For any questions or support, please contact the development team.