import tripPointsIcons from "./constants/tripPointIcons";

const Methods = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

class API {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint.replace(/\/$/, ``);
    this._authorization = authorization;
    this.tripPointIcons = tripPointsIcons;
  }

  getTripPoints() {
    return this._request({
      url: `/points`,
    })
      .then((response) => response.json())
      .then((tripPoints) => {
        console.log(tripPoints);
        return tripPoints.map((tripPoint) => ({
          id: tripPoint.id,
          icon: this.tripPointIcons[tripPoint.type],
          tripType: tripPoint.type,
          city: tripPoint.destination,
          startTime: tripPoint.date_from,
          endTime: tripPoint.date_to,
          price: tripPoint.base_price,
          isFavorite: tripPoint.is_favorite,
          offers: tripPoint.offers,
        }));
      });
  }

  getTripPointDestinations() {
    return this._request({
      url: `/destinations`,
    }).then((response) => response.json()
      .then((destinations) => destinations));
  }

  getTripPointOffers() {
    return this._request({
      url: `/offers`,
    }).then((response) => response.json()
      .then((offers) => offers));
  }

  createTripPoint(state) {
    const newTripPoint = {
      'id': state.id,
      'base_price': state.price,
      'date_from': state.startTime,
      'date_to': state.endTime,
      'destination': state.city,
      'is_favorite': state.isFavorite,
      'offers': state.offers,
      'type': state.tripType,
    };

    return this._request({
      url: `/points`,
      method: Methods.POST,
      body: newTripPoint,
    }).then((response) => response.json()
      .then((tripPoint) => tripPoint));
  }

  updateTripPoint(state) {
    const newTripPoint = {
      'id': state.id,
      'base_price': state.price,
      'date_from': state.startTime,
      'date_to': state.endTime,
      'destination': state.city,
      'is_favorite': state.isFavorite,
      'offers': state.offers,
      'type': state.tripType,
    };
    return this._request({
      url: `/points/${state.id}`,
      method: Methods.PUT,
      body: newTripPoint,
    }).then((response) => response.json()
      .then((tripPoint) => tripPoint));
  }

  deleteTripPoint(id) {
    return this._request({
      url: `/points/${id}`,
      method: Methods.DELETE,
      body: null,
      headers: new Headers({
        'Authorization': this._authorization,
        'Content-Type': `application/json`
      })

    });
  }

  _request({
    url,
    method = Methods.GET,
    body = null,
    headers = new Headers({
      'Authorization': this._authorization,
      'Content-Type': `application/json`
    })
  }) {
    return fetch(
        `${this._endPoint}/${url.replace(/^\//, ``)}`,
        {
          method,
          body: body && JSON.stringify(body),
          headers
        }
    )
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}

export default new API({
  endPoint: `https://es8-demo-srv.appspot.com/big-trip`,
  authorization: `Basic 4c4e0439-63c9-42b5-9679-2749dc729f33`
});
