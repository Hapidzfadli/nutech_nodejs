# Deployment Steps for NuTech PPOB API

## 1. Server Preparation

1. Ensure Docker and Docker Compose are installed on your server
2. Configure your domain DNS to point nutech-test.hapidzfadli.com to your server IP

## 2. Project Setup

1. Upload your project files to the server
2. Make sure to include the DDL SQL file in the project root

## 3. Docker Setup

1. Navigate to the project directory
2. Build and run the containers:
   ```bash
   docker-compose up -d
   ```
3. This will:
   - Build the Node.js application container
   - Create a MySQL container with the database schema
   - Set up volumes for persistent data

## 4. Nginx Configuration

1. Copy the provided nginx.conf to your Nginx configuration directory:
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/nutech-test.hapidzfadli.com
   ```
2. Create a symbolic link to enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nutech-test.hapidzfadli.com /etc/nginx/sites-enabled/
   ```
3. Update the path in the configuration to point to your uploads directory:

   ```bash
   sudo nano /etc/nginx/sites-available/nutech-test.hapidzfadli.com
   ```

   Change `/path/to/your/app/uploads/` to the actual path on your server

4. Test the Nginx configuration:
   ```bash
   sudo nginx -t
   ```
5. Reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```

## 5. SSL Configuration (Optional but Recommended)

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```
2. Obtain a certificate:
   ```bash
   sudo certbot --nginx -d nutech-test.hapidzfadli.com
   ```
3. Follow the prompts to complete the setup

## 6. Verification

1. Test your API endpoints using Postman or any API testing tool
2. Verify that file uploads work correctly
3. Check the logs for any errors:
   ```bash
   docker-compose logs -f app
   ```

## Maintenance

- To update the application:
  ```bash
  git pull
  docker-compose down
  docker-compose up -d --build
  ```
- To back up the database:
  ```bash
  docker exec nutech-ppob-db mysqldump -u nutech_user -pnutech_password nutech_ppob > backup.sql
  ```
