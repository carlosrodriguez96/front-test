import Service from './Service.js';
export default {
   
    createBill(data, options) {
        return Service.post('create-bill',data, options);
    },
    getBills(options) {
        return Service.get('getBills',options);
    },
    getBillById(id, options) {
        return Service.get('getBill/'+id, options);
    }
    
}