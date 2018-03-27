import React from 'react';

class SetUp extends React.Component {
    constructor() {
        super();
        this.state = {
            startLat:'',
            startLong: '',
            setUpComplete: false,
            setUpPostponed: false
        }
    this.captureCurrentLocation=this.captureCurrentLocation.bind(this);
    this.locationCaptured = this.locationCaptured.bind(this);
    this.getDistanceFromLatLonInKm = this.getDistanceFromLatLonInKm.bind(this);
    this.evaluateDistance = this.evaluateDistance.bind(this);
    // this.deg2rad = this.deg2rad.bind(this);
    }

    captureCurrentLocation(event) {
        event.preventDefault();
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.locationCaptured);
            let watch = navigator.geolocation.watchPosition(this.evaluateDistance);
        }
    }

    locationCaptured(position) {
        this.setState({
            startLat: position.coords.latitude,
            startLong: position.coords.longitude
        })
        console.log(position);
    }
    
    evaluateDistance(position) {
        this.getDistanceFromLatLonInKm(this.state.startLat,this.state.startLong, position.coords.latitude, position.coords.longitude);
        // >0.2?
        // console.log('far')
        // :console.log('not far')
    }

    getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = (lat2-lat1) * (Math.PI/180);  // deg2rad below
        var dLon = (lon2-lon1) * (Math.PI/180); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        console.log(d);
    }
      
    // watchLocation() {
    //     if(navigator.geolocation){
    //         let watch = navigator.geolocation.watchPosition(this.locationCaptured);
    //         console.log(watch);
    //     }
    // }

    postponeSetUp(event) {
        event.preventDefault();
        this.setState({
            setUpPostponed: true
        })
    }

    render() {
        return(
            <form>
                <h1>Are you home?</h1>
                <button onClick={(event) => this.captureCurrentLocation(event)}>YES</button>
                <button onClick={(event) => this.postponeSetUp(event)}>NO</button>
                {
                    this.state.setUpPostponed?
                    <div className="modal">
                        <p>Please complete the set up once you are back home!</p>
                    </div>
                    :null
                }
            </form>
        )
    }
}

export default SetUp;