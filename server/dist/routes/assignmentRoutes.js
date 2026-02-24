"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignmentController_1 = require("../controllers/assignmentController");
const router = (0, express_1.Router)();
router.post('/run', assignmentController_1.executeAssignment);
router.get('/stats', assignmentController_1.getStats);
router.get('/history', assignmentController_1.getHistory);
router.post('/reset', assignmentController_1.resetAssignments);
exports.default = router;
//# sourceMappingURL=assignmentRoutes.js.map