import ticketModel from "./models/ticket.model.js";

export default class Ticket {
    getTickets = async () => {
        return await ticketModel.find()
    }

    getTicketById = async (id) => {
        return await ticketModel.findById(id)
    }

    createTicket = async (ticket) => {
        return await ticketModel.create(ticket)
    }

}