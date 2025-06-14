# DisasterIQ - Disaster Monitoring & Observability Platform

A comprehensive disaster monitoring and observability platform built with modern cloud-native technologies.

## 📋 Features

- Real-time disaster monitoring dashboard
- Interactive global disaster map with filtering
- Alert management system
- System monitoring with Prometheus and Grafana
- NASA API integration for disaster data

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- npm or yarn package manager
- Docker and Docker Compose (for monitoring stack)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/disaster-iq.git
   cd disaster-iq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key_here
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

   # Monitoring Configuration
   PROMETHEUS_PORT=9090
   GRAFANA_PORT=3001
   ALERTMANAGER_PORT=9093

   # Application Configuration
   NODE_ENV=development
   ```
   
   > Note: You can use `DEMO_KEY` for the NASA API key for testing purposes.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start monitoring stack with Docker Compose**
   ```bash
   docker-compose up -d
   ```

6. **Access Services**
   - Next.js Application: http://localhost:3000
   - Grafana Dashboard: http://localhost:3001 (username: admin, password: admin)
   - Prometheus Metrics: http://localhost:9090

## 📊 Pages and Features

1. **Dashboard (Home Page)**
   - Overview of active disasters
   - Recent alerts
   - System status

2. **Map**
   - Interactive global map showing disasters
   - Filter by disaster type and time range
   - Detailed information for each disaster

3. **Alerts**
   - List of recent alerts
   - Filter by alert type
   - Alert settings and notification channels

4. **Monitoring**
   - System metrics visualization
   - Service health status
   - External service monitoring

## 🧪 API Endpoints

1. **GET /api/disasters**
   - Returns a list of disasters
   - Query parameters:
     - `type`: Filter by disaster type (wildfires, earthquakes, floods, storms, volcanoes)
     - `timeRange`: Filter by time range (12h, 24h, 7d, 30d)

2. **GET /api/alerts**
   - Returns a list of system alerts
   - Query parameters:
     - `type`: Filter by alert type (disaster, system)

3. **GET /api/metrics**
   - Returns Prometheus-formatted metrics for system monitoring

## 📈 Monitoring Stack

The application comes with a pre-configured monitoring stack using:

- **Prometheus**: For metrics collection and storage
- **Grafana**: For visualization and dashboards
- **Alertmanager**: For alert management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[MIT](LICENSE)

---

*Built with ❤️ for disaster monitoring and observability*
