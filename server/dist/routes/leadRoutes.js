"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leadController_1 = require("../controllers/leadController");
const router = (0, express_1.Router)();
router.get('/', leadController_1.getLeads);
exports.default = router;
//# sourceMappingURL=leadRoutes.js.map