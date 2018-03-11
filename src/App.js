import React, { Component } from 'react';
import MapModal from './components/Modals/MapModal';
import Backdrop from './components/Backdrop/Backdrop';

import axios from 'axios';

import logo from './images/logo.svg';
import './App.css';


class App extends Component {
  state = {
    mapModalIsOpen: false,
    json: undefined,
    zone: 1,
    type: 'weekday',
    purchase: 'advance_purchase',
    price: 4.75,
    tickets: 1
  };

  showMapModal = () => {
    this.setState({ mapModalIsOpen: true });
  };

  closeMapModal = () => {
    this.setState({ mapModalIsOpen: false });
  };

  //This loads in the json data from thinkcompany's github upon mounting of App component.
  async componentDidMount() {
    try {
      const response = await axios.get(
        'https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json'
      );
      this.setState({ json: response.data });
    } catch (error) {
      console.error(error);
    }
  }

  updatePrice() {
    let zonesArr = this.state.json.zones;
    let correctZone = zonesArr.filter(obj => obj.zone === this.state.zone);
    correctZone = correctZone[0];
    let fares = correctZone.fares;
    let correctSelection = fares.filter(fare => {
      return (
        fare.purchase === this.state.purchase && fare.type === this.state.type
      );
    });
    this.setState({ price: correctSelection[0].price });
  }

  handleZoneChange(event) {
    let number = parseInt(event.target.value);
    this.setState({ zone: number }, () => {
      this.updatePrice();
    });
  }

  //"Type" stands for "type of ticket". I'm only calling it that so it matches the API
  handleTypeChange(event) {
    this.setState({ type: event.target.value }, () => {
      this.updatePrice();
    });
  }

  handlePurchaseChange(event) {
    this.setState({ purchase: event.target.value }, () => {
      this.updatePrice();
    });
  }

  handleTicketChange(event) {
    let number = event.target.value;
    if (event.target.value === '') {
      this.setState({ tickets: number }, () => {
        this.updatePrice();
      });
    } else {
      number = parseFloat(event.target.value);
      this.setState({ tickets: number }, () => {
        number >= 10
          ? this.setState({ show10ticketMessage: true }, () => {
            this.updatePrice();
          })
          : this.setState({ show10ticketMessage: false }, () => {
            this.updatePrice();
          });
      });
    }
  }

  render() {
    return (
      <div className="App">

        <header className="App-header">
          <div className="flex-title-container">
            <img src={logo} className="App-logo" alt="SEPTA logo" />
            <h2 className="App-title">Regional Rail Fares</h2>
          </div>
        </header>

        <div className="destination septa-fare-section">
          <h3>Where are you going?</h3>
          {this.state.json ? (
            <select
              value={this.state.zone}
              onChange={e => this.handleZoneChange(e)}
            >
              {this.state.json.zones.map((obj, i) => {
                return (
                  <option key={i} value={obj.zone}>
                    {obj.name}
                  </option>
                );
              })}
            </select>
          ) : null}
          <p><a href="#" onClick={this.showMapModal}>View a Map</a></p>
        </div>

        {this.state.mapModalIsOpen ? (
          <div>
            <MapModal
              show={this.state.mapModalIsOpen}
              closed={this.closeMapModal}
            />
            <Backdrop
              show={this.state.mapModalIsOpen}
              closed={this.closeMapModal}
            />
          </div>
        ) : null}

        <div className="time septa-fare-section">
          <h3>When are you riding?</h3>
          {/* Wait the API data to be received */}
          {this.state.json ? (
            <select
              value={this.state.json.type}
              onChange={e => this.handleTypeChange(e)}
            >
              <option value="weekday">Weekday</option>
              <option value="evening_weekend">Weekend or Evening</option>
            </select>
          ) : null}
          <div className="helper-text">
            <p>
              {this.state.json ? this.state.json.info[this.state.type] + '.' : ''}
            </p>
          </div>
        </div>

        <div className="purchase-location septa-fare-section">
          <h3>Where will you purchase the fare?</h3>
          <div className="radios">
            <input
              type="radio"
              id="kiosk"
              name="purchase"
              value="advance_purchase"
              checked={this.state.purchase === 'advance_purchase'}
              onClick={e => this.handlePurchaseChange(e)}
            />
            <label className="radio-label" htmlFor="kiosk">Station Kiosk</label>
            <br />
            <input
              type="radio"
              id="onboard"
              name="purchase"
              value="onboard_purchase"
              checked={this.state.purchase === 'onboard_purchase'}
              onClick={e => this.handlePurchaseChange(e)}
            />
            <label className="radio-label" htmlFor="onboard">OnBoard</label>
          </div>
          <div className="helper-text">
            <p>Tip: Purchase your tickets at a station kiosk to save money.</p>
          </div>
        </div>

        <div className="ticket-amount septa-fare-section">
          <h3>How many rides will you need?</h3>
          <input
            type="number"
            value={this.state.tickets}
            onChange={e => this.handleTicketChange(e)}
          />
          <div className="helper-text">
            <p>Tip: A 10-Trip Ticket Strip saves money and adds convenience.</p>
            <p>
              <a
                href="https://shop.septa.org/catalog/train-tickets/10-trip-tickets"
                target="_blank"
              >
                Find out more!
              </a>
            </p>
          </div>
        </div>

        <div className="fare-total septa-fare-section">
          <h3>
            <span className="white-text">Your fare will cost</span>
            <br />
            <span className="total-price-text">
              {this.state.tickets &&
                typeof this.state.tickets === 'number' &&
                Number.isInteger(this.state.tickets) &&
                this.state.tickets < 10001 &&
                this.state.tickets > 0 &&
                this.state.price
                ? `$${(this.state.tickets * this.state.price).toFixed(2)}`
                : '--'}
            </span>
          </h3>
        </div>
      </div>
    );
  }
}

export default App;
