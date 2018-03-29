import React from 'react';
import ActiveSession from './activeSession';

class SetUp extends React.Component {
    constructor() {
        super();
        this.state = {
            startLat:'',
            startLong: '',
            setUpComplete: false,
            setUpPostponed: false,
            notificationTrigerred: false
        }
    this.captureCurrentLocation=this.captureCurrentLocation.bind(this);
    this.locationCaptured = this.locationCaptured.bind(this);
    this.getDistanceFromLatLonInKm = this.getDistanceFromLatLonInKm.bind(this);
    this.evaluateDistance = this.evaluateDistance.bind(this);
    this.watchLocation = this.watchLocation.bind(this);
    this.displayNotification = this.displayNotification.bind(this);
    this.closeModal = this.closeModal.bind(this);
    }

    // Capture user's current position once user clicks YES
    captureCurrentLocation(event) {
        event.preventDefault();
        if(navigator.geolocation){
            // Call locationCaptured function if current position is sucessfully captured
            navigator.geolocation.getCurrentPosition(this.locationCaptured, this.alertError);
            
        }
        else (alert("The browser does not support HTML5 navigator"))
    }

    // notify the user if the  position could not be retrieved
    alertError(error) {
        alert("The current position is not available");
    }

    watchLocation() {
        if(navigator.geolocation){
            // Call locationCaptured function if current position is sucessfully captured
            let watch = navigator.geolocation.watchPosition(this.evaluateDistance);
        }
        else (alert("The browser does not support HTML5 navigator"))
    }

    // Reset the default state of home address with the captured long and lat
    locationCaptured(position) {
        this.setState({
            startLat: position.coords.latitude,
            startLong: position.coords.longitude,
            setUpComplete: true
        // POST captured long and lat to the /users endpoint to save the data
        }, () => fetch('http://localhost:3000/users/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "lat": position.coords.latitude,
                "long": position.coords.longitude
            })
            }).then(function(response) {
                return response.json()
                }).then(function(json) {
                console.log('parsed json: ', json);
                }).catch(function(ex) {
                console.log('parsing failed: ', ex)
        }))
        this.watchLocation();
    }
    
    evaluateDistance(position) {
        let newLocation;
        this.getDistanceFromLatLonInKm(this.state.startLat,this.state.startLong, position.coords.latitude, position.coords.longitude)>0.2?
        fetch('http://localhost:3000/outside/')
        .then(function(response) {
            return response.json()
        }).then((json) => {
            console.log('parsed json: ', json);
            this.displayNotification(json);
        }).catch(function(ex) {
            console.log('parsing failed: ', ex)}
        )
        // return <Notification />
        :
        fetch('http://localhost:3000/inside/')
        .then(function(response) {
            return response.json()
        }).then((json) => {
            console.log('parsed json: ', json);
            this.displayNotification(json);
        }).catch(function(ex) {
            console.log('parsing failed: ', ex)
        })
    }

    // Use Haversine formula to calculate the distance between home and current position based on respective long and lat values
    getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2-lat1) * (Math.PI/180);
        var dLon = (lon2-lon1) * (Math.PI/180); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
    }


    // Reset setUpPostponed state to fire user notification when button NO is clicked
    postponeSetUp(event) {
        event.preventDefault();
        this.setState({
            setUpPostponed: true
        })
    }

    closeModal() {
        this.setState({
            setUpPostponed: false
        })
    }

    displayNotification(json) {
        json.map((location) => {
            location.outside?
            (this.state.notificationTrigerred === false?
                (   
                    alert("Do not forget to lock the door!"),
                    this.setState({notificationTrigerred:true})

                )
                :null
            )
            : 
            (this.state.notificationTrigerred === true?
                this.setState({notificationTrigerred:false})
                :null
            )
            // console.log(location.outside);
        })
    }

    render() {
        return(
            <form>
                <h1>Are you home?</h1>
                <div className="formControls">
                    <button onClick={(event) => this.captureCurrentLocation(event)}>YES</button>
                    <button onClick={(event) => this.postponeSetUp(event)}>NO</button>
                </div>
                {
                    this.state.setUpComplete?
                    <div className="modal">
                        <div>
                            <p>Session is active</p>
                        </div>
                    </div>
                    :null
                }
                {
                    this.state.setUpPostponed?
                    <div className="modal">
                        <div>
                            <a href="#" className="closePopUp" onClick={this.closeModal}><i className="fas fa-times"></i></a>
                            <p>Please complete the set up once you are back home!</p>
                        </div>
                    </div>
                    :null
                }
            </form>
        )
    }
}

export default SetUp;