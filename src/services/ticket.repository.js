export default class TicketRepository{

    constructor(dao){
        this.dao=dao
    }

    getTickets = async () => {
        return await this.dao.getTickets()
    }

    getTicketsById = async (id) => {
        return await this.dao.getTicketsById(id)
    }

    createTicket = async (ticket) => {
        return await this.dao.createTicket(ticket);
    }

}