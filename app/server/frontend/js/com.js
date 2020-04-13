

class Communication{

    constructor(endpoint){
        this.endpoint = endpoint;
    }

    send(method, datajson, callback){
        var requestOptions = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            method: method,
            redirect: 'follow',
            credentials: 'same-origin',
            mode: 'same-origin'
        };
        if(!method.includes("GET")){
            requestOptions.body = JSON.stringify(datajson);
        }
        fetch(this.endpoint, requestOptions)
            .then(response => response.json())
            .catch(error => console.log('Error:' + error))
            .then(response => callback(response));
    }

}