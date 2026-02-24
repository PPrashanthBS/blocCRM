"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const salesCallerRoutes_1 = __importDefault(require("./routes/salesCallerRoutes"));
const assignmentRoutes_1 = __importDefault(require("./routes/assignmentRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to database
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/leads', leadRoutes_1.default);
app.use('/api/sales-callers', salesCallerRoutes_1.default);
app.use('/api/assignments', assignmentRoutes_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map