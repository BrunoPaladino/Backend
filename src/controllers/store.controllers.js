import { StoreService } from "../services/index.js";

export const getStores = async (req, res) => {
    const result = await StoreService.getStores();
    res.json({status: 'success', payload: result})
}

export const getStoreById = async (req, res) => {
    const id = req.params.pid;
    console.log(id)
    const result = await StoreService.getStoreById(id)
    res.json({status: 'success', payload: result})
}

export const addStore = async (req, res) => {
    const store = req.body;
    const result = await StoreService.addStore(store);
    res.send({status: 'success', payload: result})
}

export const addProduct = async (req, res) => {
    const product = req.body;
    const id = req.params;
    try{
        const result = await StoreService.addProduct(id, product);
        req.developmentLogger.info(`Product added to the store: ${JSON.stringify(product)}`)
        res.send({status: 'success', payload: result})
    }
    catch (error){
        req.developmentLogger.error(`Error adding the product to the store: ${error}`)
        res.status(500).send({status: 'error', message: 'Error al agregar producto al carrito'});
    }
}