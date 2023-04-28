E-Commerce

### ERD
<img width="666" alt="Screenshot 2023-04-27 at 1 30 06 PM" src="https://user-images.githubusercontent.com/61726800/235062025-61976f94-0947-47bd-b42b-54e11d501599.png">

### Requirements
- Node.js ^16.13.1
- Docker ^20.10.8
- Prisma ^3.4.1

### Installation
1. Clone the repo
   ```sh
   git clone
    ```
2. Install NPM packages
   ```sh
   npm install
    ```
3. Generate Environment
    ```sh
   echo "DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database>?schema=public" > .env
    ```
4. Prisma Client generate
   ```sh
   npx prisma generate
   ```
   
5. Migrate database
   ```sh
   npx prisma db push --preview-feature
   ```
   
5. Run the app
   ```sh
   npm start
   ```

### Docker
1. Build the image
   ```sh
   docker build -t <your username>/node-web-app .
   ```
2. Run the image
   ```sh
    docker run -p 49160:8080 -d <your username>/node-web-app
    ```
3. Print app output
   ```sh
   docker logs <container id>
   ```
   
