# Customer Management System

A robust, full-stack Customer Management System. This application supports high-performance data processing, capable of effortlessly managing and bulk-uploading over 1,000,000+ customer records without memory leaks or UI freezing.

## 🚀 Technologies Used
- **Backend**: Java 8, Spring Boot, Spring Data JPA, Hibernate, Maven
- **Frontend**: React JS, Vite, Tailwind CSS, Axios
- **Database**: MariaDB
- **Testing**: JUnit 5, Mockito

## 📋 Features
- **CRUD Operations**: create, read, update, and delete customers.
- **Master Data**: `City` and `Country` entities exist as master data tables in the backend schema.
- **Massive Scale Bulk Uploads**: Upload Excel files containing up to 1,000,000+ records. Utilizes Apache POI SAX parsing and background Threading (`@Async`) to ensure maximum memory stability (preventing `OutOfMemoryError`).
- **Live Polling**: Real-time progress tracker in the UI during heavy bulk uploads.
- **True Server-Side Pagination**: Efficiently pages and loads thousands of records using Spring Data `Pageable`.
- **Debounced Server-Side Search**: Search globally across Name and NIC instantly using optimized JPA queries.

## ⚙️ Setup & Installation

### 1. Database Configuration (MariaDB)
1. Create a database named `cms_db` in your local MariaDB instance:
   ```sql
   CREATE DATABASE cms_db;
   ```
2. Import the provided schema and sample data. You can find `cms_db_full.sql` in the root directory.
   ```bash
   mysql -u root -p cms_db < cms_db_full.sql
   ```
3. Update the database credentials in `cms/src/main/resources/application.properties` to match your local setup:
   ```properties
   spring.datasource.url=jdbc:mariadb://localhost:3306/cms_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

### 2. Running the Backend (Spring Boot)
1. Navigate to the `cms` directory:
   ```bash
   cd cms
   ```
2. Build and run the application using Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
The backend will start running on `http://localhost:8080`.

### 3. Running the Frontend (React JS)
1. Open a new terminal and navigate to the `cms-frontend` directory:
   ```bash
   cd cms-frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
The frontend will be accessible at `http://localhost:5173`.

## 🧪 Testing
The backend is fully equipped with JUnit test coverage for the Controllers, Services, and Repositories. Run the tests using:
```bash
cd cms
mvn test
```

## 🏗️ Architecture Highlights
- **`CustomerSheetHandler.java`**: Implements `SheetContentsHandler` to read Excel files via SAX XML stream parsing instead of the standard DOM approach, drastically reducing memory footprint during bulk imports.
- **Upsert Logic**: Uses `INSERT INTO ... ON DUPLICATE KEY UPDATE` to effortlessly handle customer record updates during bulk uploads.
