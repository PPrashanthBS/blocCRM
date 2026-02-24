"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesCallerController_1 = require("../controllers/salesCallerController");
const router = (0, express_1.Router)();
router.get('/', salesCallerController_1.getSalesCallers);
router.post('/', salesCallerController_1.createSalesCaller);
router.patch('/:id', salesCallerController_1.updateSalesCaller);
router.delete('/:id', salesCallerController_1.deleteSalesCaller);
exports.default = router;
//# sourceMappingURL=salesCallerRoutes.js.map