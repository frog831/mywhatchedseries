import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import TheTVHUB from '../Utils/thetvdbAPI.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import LOG from '../Utils/logger.js';

class SeriesFinder extends Component {
  constructor(props) {
    super(props);
    this.tvhub = new TheTVHUB();
    this.tvhub.doLoginTVHUB();
    this.state = {
      options: [],
      value: ''
    };

  }

  _onChange = (value) => {
    LOG("newText: " + value);
    this.setState({
      value: value
    });
  }

  getSerieID = async (serieName) => {
    if (!serieName) {
      return Promise.resolve({ options: [] });
    }

    if (!this.tvhub.isLoggedInTVHUB()) {
      LOG("Trying to fetch serieId without being logged in to theTVHub, abort operation");
      return Promise.resolve({ options: [] });
    }

    let response = await this.tvhub.getSerieID(serieName);
    return { options: response.data.data }
  }
  gotoSerie(value, event) {
    window.open('http://thetvdb.com/?tab=series&id=' + value.id);
  }

  _renderMenuItemChildren = (option) => {
    return (
      <div key={option.id} className={(option.status === 'Ended') ? 'endedSeries' : ''}>
        <img
          src={'http://thetvdb.com/banners/_cache/' + option.banner}
          style={{
            height: 'auto',
            marginRight: '10px',
            maxWidth: '200px'
          }}
          alt={"banner-" + option.id}
        />
        <span>{option.seriesName} {(option.status === 'Ended') ? "- (Ended)" : ''}</span>
      </div>
    );
  }
  submitForm(e) {
    e.preventDefault();
    this.props.onUpdateFavouriteSeries(this.state.value);
    /*
    axios.post(e.target.action, {'array':JSON.parse(JSON.stringify(this.state.value))}).then(result => {
        ReactDOM.render(<pre> {JSON.stringify(result.data.array,null,4)} </pre>, document.getElementById('formResult'));
    });
    */
  }

  render() {
    const AsyncComponent = Select.Async;

    LOG("render method called");
    return (
      <div>
        <form onSubmit={this.submitForm.bind(this)} className="form-horizontal" id="favouriteSeries" method="post">
          <AsyncComponent
            multi={true}
            name="searchSeries"
            value={this.state.value}
            valueKey="id"
            labelKey="seriesName"
            loadOptions={this.getSerieID}
            onInputChange={(value) => { this.setState({ typedValue: value }); }}
            onChange={this._onChange}
            minimumInput={3}
            onValueClick={this.gotoSerie}
            optionRenderer={this._renderMenuItemChildren} />
          <button type="submit" className="btn btn-primary">Add Series</button>
        </form>
        <div id="formResult" />
      </div>
    );
  }
  //             onInputChange={this._onChange}
}

export default SeriesFinder;