#!/bin/bash

# Integration script to copy frontend build to Spring Boot static folder
echo "Starting frontend-backend integration..."

# Check if frontend dist folder exists
if [ ! -d "../dist" ]; then
    echo "Frontend dist folder not found. Building frontend first..."
    cd ..
    npm run build
    cd backend
fi

# Create static directory if it doesn't exist
mkdir -p src/main/resources/static

# Clean existing static files
echo "Cleaning existing static files..."
rm -rf src/main/resources/static/*

# Copy frontend build to static folder
echo "Copying frontend build to static folder..."
cp -r ../dist/* src/main/resources/static/

# Create index.html redirect for root path
echo "Creating root redirect..."
cat > src/main/resources/static/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Multi-Template Demo</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        .container { max-width: 600px; margin: 0 auto; text-align: center; }
        .template-links { margin: 30px 0; }
        .template-links a { 
            display: inline-block; 
            margin: 10px; 
            padding: 10px 20px; 
            background: #007bff; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
        }
        .template-links a:hover { background: #0056b3; }
        .api-links { margin-top: 30px; padding-top: 30px; border-top: 1px solid #ccc; }
        .api-links a { color: #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Multi-Template Frontend + Spring Boot Backend</h1>
        <p>Choose a template to explore:</p>
        
        <div class="template-links">
            <a href="/dashboard.html">Dashboard Template</a>
            <a href="/multipurpose.html">Multipurpose Template</a>
        </div>
        
        <div class="api-links">
            <h3>API Endpoints</h3>
            <p><a href="/api/users" target="_blank">GET /api/users</a> - List all users</p>
            <p><a href="/h2-console" target="_blank">H2 Database Console</a> (JDBC URL: jdbc:h2:mem:testdb)</p>
        </div>
    </div>
</body>
</html>
EOF

echo "Frontend-backend integration completed successfully!"
echo "Frontend files copied to: src/main/resources/static/"
echo "Run 'mvn spring-boot:run' to start the integrated application on http://localhost:8080"