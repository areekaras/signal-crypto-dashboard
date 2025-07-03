# Signal: A High-Performance React Native Cryptocurrency Dashboard

> **![Signal Crypto App](/assets/final-app-video.mp4){: width="350" }**

Signal is a real-time cryptocurrency tracking application for the iOS and Android platforms, conceived and executed as a personal 7-day development challenge. This project serves as a demonstration of a modern, production-ready React Native technology stack, emphasizing high-performance features, a clean architectural pattern, and a refined user experience.

The entire development lifecycle, from initial environment configuration to final user interface polish, was completed in under 11 hours of focused development time. The process has been comprehensively documented in a series of daily technical blog posts.

---

## 📖 Project Development Chronicle

The development of this application was documented publicly to provide insight into the engineering process. The complete chronicle, detailing problem-solving approaches, architectural decisions, and implementation details, is available through the following series of posts.

- **[Day 1: Environment Configuration and Troubleshooting](https://shibiliareekara.com/posts/day-1-of-7-day-challenge-when-a-blank-slate-becomes-the-first-boss-battle/)**
- **[Day 2: UI Skeleton Implementation and Initial Data Fetching](https://shibiliareekara.com/posts/day-2-of-7-day-challenge-full-throttle-from-skeleton-to-live-data/)**
- **[Day 3: WebSocket Integration and Data Visualization](https://shibiliareekara.com/posts/day-3-of-7-day-challenge-real-time-data-charting-and-the-perils-of-force/)**
- **[Day 4: React Component Memoization for Performance Optimization](https://shibiliareekara.com/posts/day-4-the-40-minute-optimization-every-react-developer-should-know/)**
- **[Day 5: Advanced Debugging of State, Render Loops, and Caching](https://shibiliareekara.com/posts/day-5-one-feature-three-bugs-and-the-reality-of-senior-engineering/)**
- **[Day 6: User Interface and Experience Refinements](https://shibiliareekara.com/posts/day-6-the-art-of-polish-refining-ui-and-bringing-it-to-life/)**

---

## 🚀 Core Functionality

- **Real-Time Data Streaming:** Utilizes a persistent WebSocket connection to the Coinbase Pro API to stream live price updates for over 100 cryptocurrency pairs.
- **Optimized List Virtualization:** Presents the top 100 cryptocurrencies in a performant, virtualized list that is optimized with `React.memo` and `getItemLayout` to efficiently handle high-frequency data updates.
- **Data Visualization:** Provides a detailed view for each asset, rendering a 7-day historical price chart using the `react-native-chart-kit` library.
- **User-Specific Watchlist:** Enables users to select and monitor preferred assets in a dedicated watchlist.
- **Local Data Persistence:** Employs `@react-native-async-storage/async-storage` to persist the user's watchlist on the device, ensuring data retention between sessions.
- **Refined User Interface:** Features a clean, dark-mode interface with subtle `LayoutAnimation` to enhance the user experience during list manipulation.
- **API Resilience:** Incorporates a client-side caching mechanism for historical chart data to mitigate API rate-limit errors and improve performance on subsequent data requests.

---

## 🛠️ Technical Architecture

The application was engineered using a selection of modern, scalable, and performant technologies.

- **Framework:** React Native (managed with the Expo framework)
- **Language:** TypeScript
- **State Management:** **Zustand**, a lightweight state management solution, was chosen for its minimal boilerplate and direct, hook-based API for managing global application state.
- **Navigation:** React Navigation, utilizing both Stack and Bottom Tab Navigators to construct a standard and intuitive mobile navigation architecture.
- **Data Fetching:**
  - **REST API:** `Axios` is used for asynchronous HTTP requests to the CoinGecko API for initial asset data and historical chart information.
  - **Real-Time:** The native `WebSocket` API is implemented for a persistent, low-latency connection to the Coinbase Pro live ticker feed.
- **Local Storage:** `@react-native-async-storage/async-storage` provides local data persistence for the user's watchlist.
- **Charting:** `react-native-chart-kit` and its `react-native-svg` dependency are used for data visualization.
- **AI-Assisted Development:** The official **Gemini CLI** was leveraged to augment the development process by generating boilerplate code and providing solutions, thereby enabling a greater focus on high-level architectural design and complex problem-solving.

---

## 🧠 Significant Engineering Challenges and Resolutions

The project's development involved addressing several key technical challenges, which informed significant architectural decisions.

1.  **Refactoring State Management for UI Consistency:** An initial implementation of the watchlist feature using a custom React hook resulted in a "stale state" bug. The architecture was refactored to utilize the global Zustand store, establishing a single source of truth and ensuring immediate, reactive UI updates across all components.
2.  **Resolution of an Infinite Render Loop:** A "Maximum update depth exceeded" error was identified, caused by an infinite render loop within the `DetailsScreen` component. The issue was resolved by implementing granular Zustand selectors to prevent unnecessary re-renders and by memoizing callback functions with `useCallback` to stabilize dependencies in the `useLayoutEffect` hook.
3.  **Implementation of API Rate-Limit Mitigation:** The application experienced crashes due to API rate-limiting (`429` errors) from repeated requests for chart data. A client-side caching strategy was implemented within the Zustand store, which made the application more resilient and significantly improved performance on subsequent screen views.
4.  **Strategic Performance Trade-offs:** A `VirtualizedList` performance warning related to high-frequency WebSocket updates was identified. After implementing all standard optimizations (`React.memo`, `getItemLayout`), a pragmatic decision was made to accept this known limitation of the `FlatList` component to adhere to the project's timeline, prioritizing the completion of core features over a major refactor to a specialized list library.

---

## ⚙️ Local Development Setup

To run this project in a local environment, please follow the subsequent steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/areekaras/signal-crypto-dashboard.git](https://github.com/areekaras/signal-crypto-dashboard.git)
    cd signal-crypto-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Execute the application:**
    ```bash
    npx expo start
    ```
    Subsequently, press `i` to launch the iOS Simulator or `a` to launch the Android Emulator.
