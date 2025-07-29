const router = require("express").Router();
const logger = require("../../../logger");
const TourService = require("../../services/tourService");

router.post("/", async (req, res) => {
    try {
        logger.api("POST /api/tour - Creating new tour", {
            body: req.body,
            user_id: req.user_id
        });

        const tourData = {
            client_name: req.body.client_name,
            client_contact: req.body.client_contact,
            contact_type: req.body.contact_type || 'whatsapp',
            tour_date: req.body.tour_date,
            guide_name: req.body.guide_name,
            total_value: req.body.total_value,
            guide_commission: req.body.guide_commission,
            commission_type: req.body.commission_type || 'percentage',
            client_payment_status: req.body.client_payment_status || 'pending',
            guide_payment_status: req.body.guide_payment_status || 'pending'
        };

        const result = await TourService.createTour(tourData);
        
        logger.api("POST /api/tour - Tour created successfully", {
            tourId: result.tourId,
            user_id: req.user_id
        });

        res.status(201).json({
            success: true,
            message: result.message,
            tourId: result.tourId
        });
    } catch (error) {
        logger.error("POST /api/tour - Error creating tour", {
            error: error.message,
            user_id: req.user_id
        });

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        logger.api("GET /api/tour - Fetching all tours", {
            user_id: req.user_id
        });

        const tours = await TourService.getAllTours();
        
        logger.api("GET /api/tour - Tours fetched successfully", {
            count: tours.length,
            user_id: req.user_id
        });

        res.status(200).json({
            success: true,
            data: tours,
            count: tours.length
        });
    } catch (error) {
        logger.error("GET /api/tour - Error fetching tours", {
            error: error.message,
            user_id: req.user_id
        });

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const tourId = req.params.id;
        
        logger.api("GET /api/tour/:id - Fetching tour by ID", {
            tourId,
            user_id: req.user_id
        });

        const tour = await TourService.getTourById(tourId);
        
        logger.api("GET /api/tour/:id - Tour fetched successfully", {
            tourId,
            user_id: req.user_id
        });

        res.status(200).json({
            success: true,
            data: tour
        });
    } catch (error) {
        logger.error("GET /api/tour/:id - Error fetching tour", {
            tourId: req.params.id,
            error: error.message,
            user_id: req.user_id
        });

        const statusCode = error.message.includes("não encontrado") ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const tourId = req.params.id;
        
        logger.api("PUT /api/tour/:id - Updating tour", {
            tourId,
            body: req.body,
            user_id: req.user_id
        });

        const result = await TourService.updateTour(tourId, req.body);
        
        logger.api("PUT /api/tour/:id - Tour updated successfully", {
            tourId,
            user_id: req.user_id
        });

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        logger.error("PUT /api/tour/:id - Error updating tour", {
            tourId: req.params.id,
            error: error.message,
            user_id: req.user_id
        });

        const statusCode = error.message.includes("não encontrado") ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const tourId = req.params.id;
        
        logger.api("DELETE /api/tour/:id - Deleting tour", {
            tourId,
            user_id: req.user_id
        });

        const result = await TourService.deleteTour(tourId);
        
        logger.api("DELETE /api/tour/:id - Tour deleted successfully", {
            tourId,
            user_id: req.user_id
        });

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        logger.error("DELETE /api/tour/:id - Error deleting tour", {
            tourId: req.params.id,
            error: error.message,
            user_id: req.user_id
        });

        const statusCode = error.message.includes("não encontrado") ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/date-range", async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        logger.api("GET /api/tour/date-range - Fetching tours by date range", {
            startDate,
            endDate,
            user_id: req.user_id
        });

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Data inicial e data final são obrigatórias"
            });
        }

        const tours = await TourService.getToursByDateRange(startDate, endDate);
        
        logger.api("GET /api/tour/date-range - Tours by date range fetched successfully", {
            startDate,
            endDate,
            count: tours.length,
            user_id: req.user_id
        });

        res.status(200).json({
            success: true,
            data: tours,
            count: tours.length
        });
    } catch (error) {
        logger.error("GET /api/tour/date-range - Error fetching tours by date range", {
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            error: error.message,
            user_id: req.user_id
        });

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.get("/guide/:guideName", async (req, res) => {
    try {
        const guideName = req.params.guideName;
        
        logger.api("GET /api/tour/guide/:guideName - Fetching tours by guide", {
            guideName,
            user_id: req.user_id
        });

        const tours = await TourService.getToursByGuide(guideName);
        
        logger.api("GET /api/tour/guide/:guideName - Tours by guide fetched successfully", {
            guideName,
            count: tours.length,
            user_id: req.user_id
        });

        res.status(200).json({
            success: true,
            data: tours,
            count: tours.length
        });
    } catch (error) {
        logger.error("GET /api/tour/guide/:guideName - Error fetching tours by guide", {
            guideName: req.params.guideName,
            error: error.message,
            user_id: req.user_id
        });

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;

