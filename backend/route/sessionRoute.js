import express from "express";
import isAuth from "../middleware/isauth.js";
import {
  requestSession,
  getEducatorSessionRequests,
  approveSessionRequest,
  rejectSessionRequest,
  getStudentSessionRequests,
  cancelSessionRequest,
  getSessionRequestDetail
} from "../contollers/sessionRequestController.js";

const router = express.Router();

// Student routes
router.post("/request", isAuth, requestSession);
router.get("/my-requests", isAuth, getStudentSessionRequests);
router.put("/cancel/:requestId", isAuth, cancelSessionRequest);

// Educator routes
router.get("/educator/requests", isAuth, getEducatorSessionRequests);
router.put("/approve/:requestId", isAuth, approveSessionRequest);
router.put("/reject/:requestId", isAuth, rejectSessionRequest);

// Common routes
router.get("/detail/:requestId", isAuth, getSessionRequestDetail);

export default router;
