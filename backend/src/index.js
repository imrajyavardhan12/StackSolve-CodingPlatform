import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'
import authRoutes from "./routes/auth.routes.js"
import problemRoutes from "./routes/problem.routes.js"
import executionRoute from "./routes/execute.route.js"
import submissionRoute from "./routes/submission.route.js"
import playlistRoutes from "./routes/playlist.route.js"
import profileRoutes from "./routes/profile.routes.js"

dotenv.config()

const app = express(); 

console.log(process.env.PORT)

app.use(express.json())
app.use(cookieParser())

// Updated CORS configuration for production
const getCorsOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
        return {
            origin: function (origin, callback) {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true);
                
                const allowedOrigins = [
                    process.env.FRONTEND_URL,
                    'http://localhost:3000',
                    'http://localhost:5173'
                ];
                
                // Allow any origin from the same host (different ports)
                try {
                    const requestHost = new URL(origin).hostname;
                    const allowedHosts = ['localhost', '127.0.0.1'];
                    
                    // Add your Linode server hostname/IP
                    if (process.env.DOMAIN_URL) {
                        const domainHost = new URL(process.env.DOMAIN_URL).hostname;
                        allowedHosts.push(domainHost);
                    }
                    
                    if (allowedOrigins.includes(origin) || allowedHosts.includes(requestHost)) {
                        callback(null, true);
                    } else {
                        console.log('CORS blocked origin:', origin);
                        callback(new Error('Not allowed by CORS'));
                    }
                } catch (e) {
                    callback(new Error('Invalid origin'));
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
            exposedHeaders: ['set-cookie']
        };
    } else {
        // Development configuration
        return {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization']
        };
    }
};

app.use(cors(getCorsOptions()));

// Add trust proxy for production (important for cookies behind reverse proxy)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        message: 'Backend is running',
        environment: process.env.NODE_ENV || 'development'
    })
})

app.get('/',(req,res)=>{
    res.send('hey there its working ')
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemRoutes)
app.use('/api/v1/execute-code', executionRoute)
app.use('/api/v1/submission', submissionRoute)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/profile", profileRoutes)

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})