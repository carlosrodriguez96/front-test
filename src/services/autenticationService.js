import Service from './Service.js';

export default {
    login(data){        
        return Service.post('login',data);
    },
    logout(config){ 
        return Service.get('auth/logout',config);
    },
    validate(config){
        return Service.get('validateToken',config);
     },
    register(data){
        return Service.post('register',data);
    }
    
}