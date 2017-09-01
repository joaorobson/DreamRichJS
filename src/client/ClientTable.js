import ReactDataGrid from 'react-data-grid';
import {Link} from 'react-router-dom';
import React, {Component} from 'react';
import getData from '../resources/getData';
import {Data, Toolbar} from 'react-data-grid-addons';
import FontIcon from 'material-ui/FontIcon';
import '../stylesheet/Table.sass';

export default class ClientTable extends Component {
  constructor(props) {
    super(props);
    this.state = {_columns: [
      { key: 'name', name: 'Name', sortable: true, filterable: true, resizable: true },
      { key: 'telephone', name: 'Telefone', sortable: true, filterable: true, resizable: true },
      { key: 'email', name: 'Email', sortable: true, filterable: true, resizable: true },
      { key: 'actions', name: 'Actions', locked: true, filterable: false, resizable: false }
    ],
      rows: [], original: [], filters: {}, sortDirection: null,
      sortColumn: null};
    this.getRows = this.getRows.bind(this);
  }

  componentWillMount(){ getData('/api/client/active/', this, 'original', 'rows');}

  getRows() {
    return Data.Selectors.getRows(this.state);
  }
  
  getSize(){
    return this.getRows().length;
  }

  rowGetter(i) {
    const row = this.getRows()[i];
    row['actions'] = (<Link to="/login">
      <FontIcon className="material-icons">home</FontIcon>
      </Link>);
    return row;
  }

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  }

  onClearFilters() {
    this.setState({filters: {} });
  }

  handleSort(sortColumn, sortDirection){
    this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
    console.log(this.state);
  }

  render() {
    //console.log(this.state._rows);
    return (
      <div className="container">
        <ReactDataGrid
          columns={this.state._columns}
          onGridSort={this.handleSort.bind(this)}
          rowGetter={this.rowGetter.bind(this)}
          enableCellSelect={true}
          rowsCount={this.getSize()}
          toolbar={<Toolbar enableFilter={true}/>}
          onAddFilter={this.handleFilterChange.bind(this)}
          onClearFilters={this.onClearFilters.bind(this)}
          rowHeight={46}
          columnWidth={120}
          minHeight={500} />
      </div>);
  }
}