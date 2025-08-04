const {
    query_tour_create,
    query_tour_get_all,
    query_tour_get_count,
    query_tour_get_by_id,
    query_tour_update,
    query_tour_delete,
    query_tour_get_by_date_range,
    query_tour_get_by_date_range_count,
    query_tour_get_by_guide,
    query_tour_get_by_guide_count
} = require("../repositores/query_tour");

const logger = require("../../logger");

class TourService {
    async createTour(tourData) {
        logger.info("TourService: Creating new tour", {
            client_name: tourData.client_name,
            guide_name: tourData.guide_name,
            tour_date: tourData.tour_date
        });

        try {
            // Validações básicas
            if (!tourData.client_name || !tourData.client_contact || !tourData.tour_date || !tourData.guide_name) {
                throw new Error("Dados obrigatórios não fornecidos");
            }

            // Validar tipos de contato
            const validContactTypes = ['whatsapp', 'phone', 'email'];
            if (!validContactTypes.includes(tourData.contact_type)) {
                throw new Error("Tipo de contato inválido");
            }

            // Validar tipos de comissão
            const validCommissionTypes = ['percentage', 'fixed'];
            if (!validCommissionTypes.includes(tourData.commission_type)) {
                throw new Error("Tipo de comissão inválido");
            }

            // Validar status de pagamento
            const validPaymentStatuses = ['paid', 'pending'];
            if (!validPaymentStatuses.includes(tourData.client_payment_status) ||
                !validPaymentStatuses.includes(tourData.guide_payment_status)) {
                throw new Error("Status de pagamento inválido");
            }

            // Validar valores numéricos
            if (isNaN(parseFloat(tourData.total_value)) || parseFloat(tourData.total_value) < 0) {
                throw new Error("Valor total inválido");
            }

            if (isNaN(parseFloat(tourData.guide_commission)) || parseFloat(tourData.guide_commission) < 0) {
                throw new Error("Comissão do guia inválida");
            }

            const tour_id = await query_tour_create(tourData);

            logger.info("TourService: Tour created successfully", { tour_id });
            return { tour_id, message: "Passeio criado com sucesso" };
        } catch (error) {
            logger.error("TourService: Error creating tour", { error: error.message });
            throw new Error(error.message);
        };
    };

    async getAllTours(page = 1, limit = 10) {
        logger.info("TourService: Fetching all tours", { page, limit });

        try {
            const tours = await query_tour_get_all(page, limit);
            const totalCount = await query_tour_get_count();

            logger.info("TourService: Tours fetched successfully", { 
                count: tours.length, 
                totalCount,
                page,
                limit 
            });
            
            return {
                tours,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNextPage: page * limit < totalCount,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            logger.error("TourService: Error fetching tours", { error: error.message });
            throw new Error("Erro ao buscar passeios");
        };
    };

    async getTourById(tour_id) {
        logger.info("TourService: Fetching tour by ID", { tour_id });

        try {
            if (!tour_id || isNaN(parseInt(tour_id))) {
                throw new Error("ID do passeio inválido");
            }

            const tour = await query_tour_get_by_id(tour_id);

            if (!tour) {
                logger.warn("TourService: Tour not found", { tour_id });
                throw new Error("Passeio não encontrado");
            }

            logger.info("TourService: Tour fetched successfully", { tour_id });
            return tour;
        } catch (error) {
            logger.error("TourService: Error fetching tour", { tour_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async updateTour(tour_id, tour_data) {
        logger.info("TourService: Updating tour", { tour_id });

        try {
            if (!tour_id || isNaN(parseInt(tour_id))) {
                throw new Error("ID do passeio inválido");
            }

            // Verificar se o passeio existe
            const existingTour = await query_tour_get_by_id(tour_id);
            if (!existingTour) {
                throw new Error("Passeio não encontrado");
            }

            // Validações básicas (mesmas do create)
            if (tour_data.client_name !== undefined && !tour_data.client_name) {
                throw new Error("Nome do cliente é obrigatório");
            }

            if (tour_data.contact_type !== undefined) {
                const validContactTypes = ['whatsapp', 'phone', 'email'];
                if (!validContactTypes.includes(tour_data.contact_type)) {
                    throw new Error("Tipo de contato inválido");
                }
            }

            if (tour_data.commission_type !== undefined) {
                const validCommissionTypes = ['percentage', 'fixed'];
                if (!validCommissionTypes.includes(tour_data.commission_type)) {
                    throw new Error("Tipo de comissão inválido");
                }
            }

            if (tour_data.client_payment_status !== undefined || tour_data.guide_payment_status !== undefined) {
                const validPaymentStatuses = ['paid', 'pending'];
                if ((tour_data.client_payment_status && !validPaymentStatuses.includes(tour_data.client_payment_status)) ||
                    (tour_data.guide_payment_status && !validPaymentStatuses.includes(tour_data.guide_payment_status))) {
                    throw new Error("Status de pagamento inválido");
                }
            }

            if (tour_data.total_value !== undefined && (isNaN(parseFloat(tour_data.total_value)) || parseFloat(tour_data.total_value) < 0)) {
                throw new Error("Valor total inválido");
            }

            if (tour_data.guide_commission !== undefined && (isNaN(parseFloat(tour_data.guide_commission)) || parseFloat(tour_data.guide_commission) < 0)) {
                throw new Error("Comissão do guia inválida");
            }

            if (tour_data.tour_date !== undefined) {
                const tour_date = new Date(tour_data.tour_date);
                if (isNaN(tour_date.getTime())) {
                    throw new Error("Data inválida");
                }
            }

            const date = new Date(tour_data.tour_date);
            const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);

            tour_data.tour_date = formattedDate
            
            const success = await query_tour_update(tour_id, tour_data);

            if (!success) {
                throw new Error("Erro ao atualizar passeio");
            }

            logger.info("TourService: Tour updated successfully", { tour_id });
            return { message: "Passeio atualizado com sucesso" };
        } catch (error) {
            logger.error("TourService: Error updating tour", { tour_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async deleteTour(tour_id) {
        logger.info("TourService: Deleting tour", { tour_id });

        try {
            if (!tour_id || isNaN(parseInt(tour_id))) {
                throw new Error("ID do passeio inválido");
            }

            // Verificar se o passeio existe
            const existingTour = await query_tour_get_by_id(tour_id);
            if (!existingTour) {
                throw new Error("Passeio não encontrado");
            }

            const success = await query_tour_delete(tour_id);

            if (!success) {
                throw new Error("Erro ao deletar passeio");
            }

            logger.info("TourService: Tour deleted successfully", { tour_id });
            return { message: "Passeio deletado com sucesso" };
        } catch (error) {
            logger.error("TourService: Error deleting tour", { tour_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async getToursByDateRange(startDate, endDate, page = 1, limit = 10) {
        logger.info("TourService: Fetching tours by date range", { startDate, endDate, page, limit });

        try {
            // Validar datas
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new Error("Datas inválidas");
            }

            if (start > end) {
                throw new Error("Data inicial deve ser menor que a data final");
            }

            const tours = await query_tour_get_by_date_range(startDate, endDate, page, limit);
            const totalCount = await query_tour_get_by_date_range_count(startDate, endDate);

            logger.info("TourService: Tours by date range fetched successfully", {
                startDate,
                endDate,
                count: tours.length,
                totalCount,
                page,
                limit
            });
            
            return {
                tours,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNextPage: page * limit < totalCount,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            logger.error("TourService: Error fetching tours by date range", {
                startDate,
                endDate,
                error: error.message
            });
            throw new Error(error.message);
        };
    };

    async getToursByGuide(guide_name, page = 1, limit = 10) {
        logger.info("TourService: Fetching tours by guide", { guide_name, page, limit });

        try {
            if (!guide_name || guide_name.trim() === '') {
                throw new Error("Nome do guia é obrigatório");
            }

            const tours = await query_tour_get_by_guide(guide_name.trim(), page, limit);
            const totalCount = await query_tour_get_by_guide_count(guide_name.trim());

            logger.info("TourService: Tours by guide fetched successfully", {
                guide_name,
                count: tours.length,
                totalCount,
                page,
                limit
            });
            
            return {
                tours,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit),
                    hasNextPage: page * limit < totalCount,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            logger.error("TourService: Error fetching tours by guide", {
                guide_name,
                error: error.message
            });
            throw new Error(error.message);
        };
    };
};

module.exports = new TourService(); 