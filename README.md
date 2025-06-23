# GRCWalk - GRC Management Platform

GRCWalk is a comprehensive Governance, Risk, and Compliance (GRC) management platform built with React, TypeScript, and MySQL.

## Features

- **Risk Management**: Comprehensive risk catalog with likelihood/impact assessment
- **Control Management**: Track and manage security controls and their effectiveness
- **Bow-Tie Analysis**: Visualize risk factors and consequences
- **Compliance Monitoring**: Track compliance requirements across frameworks
- **Action Plans**: Manage remediation and improvement activities
- **Audit Planning**: Plan and track internal and external audits
- **Third-Party Risk**: Vendor risk assessment and management
- **Dashboard**: Real-time overview of risk posture and metrics

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for build tooling

### Backend
- Node.js with Express
- MySQL database
- RESTful API architecture

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grcwalk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MySQL database**
   ```sql
   CREATE DATABASE grcwalk_db;
   CREATE USER 'grcwalk_user'@'localhost' IDENTIFIED BY 'grcwalk_password';
   GRANT ALL PRIVILEGES ON grcwalk_db.* TO 'grcwalk_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=grcwalk_user
   DB_PASSWORD=grcwalk_password
   DB_NAME=grcwalk_db
   PORT=3001
   VITE_API_URL=http://localhost:3001/api
   ```

5. **Run database setup**
   The database schema and initial data will be automatically created when you start the server.

## Development

1. **Start the backend server**
   ```bash
   npm run server
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Run both concurrently**
   ```bash
   npm run dev:full
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

## Database Schema

The application uses a normalized MySQL schema with the following main entities:

- **risks**: Core risk information with likelihood/impact scoring
- **controls**: Security controls and their implementation status
- **risk_controls**: Many-to-many relationship between risks and controls
- **risk_factors**: Bow-tie analysis risk factors
- **consequences**: Bow-tie analysis consequences
- **bowtie_relationships**: Links risks to factors and consequences
- **compliance_requirements**: Compliance tracking
- **action_plans**: Remediation activities
- **audit_plans**: Audit planning and tracking
- **vendors**: Third-party risk management

## API Endpoints

### Risks
- `GET /api/risks` - Get all risks
- `POST /api/risks` - Create new risk
- `PUT /api/risks/:id` - Update risk
- `DELETE /api/risks/:id` - Delete risk

### Controls
- `GET /api/controls` - Get all controls
- `POST /api/controls` - Create new control
- `PUT /api/controls/:id` - Update control
- `DELETE /api/controls/:id` - Delete control

### Bow-tie Analysis
- `GET /api/bowtie/factors` - Get risk factors
- `GET /api/bowtie/consequences` - Get consequences
- `GET /api/bowtie/relationships` - Get bow-tie relationships
- `POST /api/bowtie/factors` - Create risk factor
- `POST /api/bowtie/consequences` - Create consequence
- `POST /api/bowtie/relationships` - Create bow-tie relationship

## Production Deployment

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set up production database**
   - Create production MySQL instance
   - Update environment variables
   - Run database migrations

3. **Deploy backend**
   - Deploy to your preferred hosting platform
   - Ensure environment variables are configured
   - Start the server with `npm run server`

4. **Deploy frontend**
   - Serve the built files from the `dist` directory
   - Configure your web server to handle client-side routing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.