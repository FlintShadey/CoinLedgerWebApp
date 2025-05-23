# CoinLedgerWebApp

A modern web application for converting cryptocurrency reward data to CoinLedger CSV format. Built with Vue 3, Vite, Vuetify, and TypeScript with a beautiful dark mode interface.

## 🚀 Features

### 💰 **GALA Rewards Converter**
- Convert GALA rewards text data to CoinLedger CSV format
- Detects "You received X GALA" entries from pasted text
- Automatically generates dates working backwards from today
- Transaction type: "Mining Income"

### ⚡ **FLUX Mining Converter**
- Convert FLUX mining text data to CoinLedger CSV format
- Parses mining confirmations with timestamps
- Extracts exact datetime and amounts from mining logs
- Fixed amount: 4.6875 FLUX per entry
- Transaction type: "Mining"

### 🌐 **POKT Rewards Converter**
- Upload and convert POKT CSV files to CoinLedger format
- Processes only "Rewards Rollover" transaction types
- Converts date format from YYYY-MM-DD to MM/DD/YYYY
- Transaction type: "Income"

### ✨ **Additional Features**
- 🌙 **Dark Mode Interface** - Modern dark theme with high contrast
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔄 **Progressive Web App** - Offline capabilities and app-like experience
- 📁 **Automatic Downloads** - CSV files download directly to your Downloads folder
- ⚡ **Real-time Processing** - Instant conversion with progress indicators
- 🎨 **Material Design** - Beautiful Vuetify components with branded logos

## 🛠️ Technology Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Build Tool**: Vite
- **UI Framework**: Vuetify 3 (Material Design)
- **Icons**: Material Design Icons
- **PWA**: vite-plugin-pwa
- **Deployment**: GitHub Pages with GitHub Actions

## 📦 Project Setup

```sh
npm install
```

### 🔧 Development Server

```sh
npm run dev
```

### 🏗️ Production Build

```sh
npm run build
```

### 🧪 Type Checking

```sh
npm run type-check
```

## 🚢 Deployment

The application is configured for GitHub Pages deployment with automatic CI/CD:

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Available at: `https://YOUR_USERNAME.github.io/CoinLedgerWebApp/`

## 📖 Usage

### GALA Converter
1. Click "Convert GALA Data"
2. Paste text containing "You received X GALA" entries
3. Click "Convert to CoinLedger Format"
4. CSV downloads as `gala_rewards_data.csv`

### FLUX Converter
1. Click "Convert FLUX Data"
2. Paste mining log text with confirmation entries
3. Click "Convert to CoinLedger Format" 
4. CSV downloads as `FLUX_output.csv`

### POKT Converter
1. Click "Convert POKT CSV"
2. Upload your POKT CSV file
3. Click "Convert to CoinLedger Format"
4. CSV downloads as `POKT_output.csv`

## 📄 CSV Output Format

All converters generate CoinLedger-compatible CSV files with these columns:
- Date (UTC)
- Platform (Optional)
- Asset Sent
- Amount Sent  
- Asset Received
- Amount Received
- Fee Currency (Optional)
- Fee Amount (Optional)
- Type
- Description (Optional)
- TxHash (Optional)

## 🎨 Screenshots

The application features a modern dark mode interface with:
- Three-column responsive layout
- Branded cryptocurrency logos
- Material Design components
- Intuitive file upload and text input dialogs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
