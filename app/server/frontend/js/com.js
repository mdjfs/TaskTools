

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
        if(datajson != null){
            requestOptions.body = JSON.stringify(datajson);
        }
        fetch(this.endpoint, requestOptions)
            .then(response => response.json())
            .catch(error => callback(null))
            .then(response => callback(response));
    }

    sendFile(method, name, file, callback){
        console.log(name);
        if(file != null && !method.includes("GET")){
            var formData = new FormData();
            formData.append(name, file);
            var requestOptions = {
                method: method,
                redirect: 'follow',
                body: formData,
                credentials: 'same-origin',
                mode: 'same-origin'
            };
            fetch(this.endpoint, requestOptions)
                .then(response => response.json())
                .catch(error => console.log('Error:' + error))
                .then(response => callback(response));
        }
    }

}