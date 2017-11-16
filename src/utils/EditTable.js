/* eslint-disable */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Check from 'material-ui/svg-icons/navigation/check';
import Delete from 'material-ui/svg-icons/action/delete';
import {times} from 'lodash';
import {IconButton,
  Toggle,
  TextField,
  RaisedButton,
  DatePicker} from 'material-ui';

import { Row, Col } from 'react-flexbox-grid';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TableRow from './TableRow';

export default class EditTable extends Component {

  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onRowSelect: PropTypes.func.isRequired,
  }

  static defaultProps = {
    headers: [],
    rows: [],
    enableDelete: true,
    onChange: () => {console.warn('onChange not implemented');},
    onDelete: () => {console.warn('need this onDelete function');},
    onAdd: () => {console.warn('need this onAdd function');},
    onRowSelect: (key) => {console.warn('need this onRowSelect' + key);}
  }

  static contextTypes = {
    muiTheme: React.PropTypes.object.isRequired
  }

  state = {
    editRow: {data: {}, key: -1}
  }

  update = (row) => {
    if (this.state.editRow.key === row.key) {
      this.props.onChange(this.state.editRow);
    } else {
      this.props.onChange(row);
    }
  }

  getCellValue = (cell) => {
    const self = this;
    const id = cell && cell.id;
    const type = this.props.headers.map((header) => header.type )[id];
    const selected = cell && cell.selected;
    const name = cell && cell.name;
    if (selected && cell && this.state.editRow.data[name]) {
      cell.value = this.state.editRow.data[name];
    }
    const value = cell && cell.value;
    const rowId = cell && cell.rowId;
    const header = cell && cell.header;
    const width = cell && cell.width;
    const textFieldId = [id, rowId, header].join('-');
    const datePickerId = [id, rowId, header].join('-');

    const textFieldStyle = { width: width };

    const datePickerStyle = { width: width };

    // Set a new state to the row is being edited
    const onChangeField = (e, value) => {
      console.log('oia');
      this.setState( (prevState, props) => {
        const {editRow} = prevState;
        editRow.data[name] = value;
        return { editRow };
      });
    }

    if (header || (type && type === 'ReadOnly')) {
      return <p style={{color: '#888'}}>{value}</p>
    }

    // Select the field to show
    if (type) {
      if (type === 'TextField') {
        return <TextField
          name={name}
          id={textFieldId}
          onChange={onChangeField}
          style={textFieldStyle}
          value={value}
          disabled={!selected}
        />;
      }
      if (type === 'DatePicker') {
        return <DatePicker
          name={name}
          id={datePickerId}
          onChange={onChangeField}
          mode='landscape'
          style={datePickerStyle}
          value={value}
          disabled={!selected}
        />;
      }
      if (type === 'Toggle') {
        return <Toggle
          onToggle={onChangeField}
          toggled={value}
          disabled={!selected}/>;
      }
    }

  }

  renderHeader = () => {
    const headerColumns = this.props.headers;
    const columns = {};
    headerColumns.forEach( column => columns[column.name] = column.value );
    const row = {data: columns, header: true};

    return <TableRow {...this.props} row={row} />;
  }

  rowWillAdd = () => {
    this.props.rows.forEach( row => {
      if (row.selected) {
        this.update(row);
      }
    });
  }

  onRowUnselect = (row) => {
    this.update(row);
  }

  renderRow = (row) => {
    const self = this;
    const columns = row.columns;
    const rowStyle = {
      width: '100%',
      display: 'flex',
      flexFlow: 'row nowrap',
      padding: row.header ? 0 : 12,
      border: 0,
      borderBottom: '1px solid #ccc',
      height: 50
    };
    const checkboxStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 50,
      height: 24,
      alignItems: 'center'
    };

    const deleteButtonStyle = {
      display: 'flex',
      flexFlow: 'row nowrap',
      width: 50,
      height: 24,
      alignItems: 'center',
      padding: '0 12 0'
    };

    const rowId = row.key;
    const rowKey = ['row', rowId].join('-');

    const selected = row.selected || false;

    const button = selected ? <Check /> : <ModeEdit />;
    const tooltip = selected ? 'Done' : 'Edit';

    const onDeleteRow = () => this.props.onDelete(rowId);
    const onRowSelect = () => {
      this.setState({editRow: row});
      this.props.onRowSelect(row);
    }

    const onClick = () => {
      if (selected) {
        this.onRowUnselect(row);
      } else {
        onRowSelect(row);
      }
    };

    const deleteButton = (!this.props.enableDelete || selected || row.header) ? 
      <div style={deleteButtonStyle} />
      : <IconButton style={deleteButtonStyle} tooltip={'Delete this row'} onClick={onDeleteRow}>
        <Delete />
      </IconButton>;

      const checkbox = row.header ? <div style={checkboxStyle} />
      : <IconButton style={checkboxStyle} tooltip={tooltip} onClick={onClick}>
        {button}
      </IconButton>;

      return (
        <div key={rowKey} className='row' style={rowStyle}>
          {checkbox}
          {this.props.headers.map( (header, id) => {
            const width = header.width;
            const cellStyle = {
              display: 'flex',
              flexFlow: 'row nowrap',
              flexGrow: 0.15,
              flexBasis: 'content',
              alignItems: 'center',
              height: 30,
              width: width || 200
            };
            const columnKey = ['column', id].join('-');
            let column = null;
            if (row.data) {
              const columnData = {
                'value': row.data[header.name],
                'width': cellStyle.width,
                'selected': selected,
                'rowId': rowId,
                'id': id,
                'name': header.name,
                'header': row.header,
                'type': header.type,
              };
              column = this.getCellValue(columnData);
            }
            return (
              <div key={columnKey} className='cell' style={cellStyle}>
                <div>
                  {column}
                </div>
              </div>
            );
          })}
          {deleteButton}
        </div>
      )
  }

  componentWillReceiveProps = (nextProps) => {
    // Transition to receive a new row and add it in editRow state
    const selectedRow = nextProps.rows.filter( row => row.selected );
    if (selectedRow.length && this.state.editRow.key !== selectedRow[0].key) {
      this.setState({editRow: selectedRow[0]});
    } else if (!selectedRow.length) {
      this.setState({editRow: {data: {}, key: -1}});
    }
  }

  addElement = () => {
    // Add a new row submiting all others activates
    const onAdd = () => {
      this.rowWillAdd();
      this.props.onAdd();
    }
    return (
        <Col xs={12} style={{marginTop: '30px'}}>
          <Row center="xs">
            <Col xs={6}>
              <FloatingActionButton key='0' onClick={onAdd}>
                <ContentAdd />
              </FloatingActionButton>
            </Col>
          </Row>
        </Col>
    );
  }

  onChangeField = (e, value) => {
    console.log('oi');
    const target = e.target;
    const name = target.name;
    this.setState( (prevState, props) => {
      const {editRow} = prevState;
      editRow.data[name] = value;
      return { editRow };
    });
  }

  onRowSelect = (row) => {
      this.setState({editRow: row});
      this.props.onRowSelect(row);
  }

  render = () => {
    const rows = this.props.rows;

    return (
      <Row>
        {this.renderHeader()}
        {rows.map( (row, idx) => {
          return <TableRow
            {...this.props}
            key={idx}
            row={row}
            onRowUnselect={this.onRowUnselect}
            onRowSelect={this.onRowSelect}
            onChangeField={this.onChangeField}
            selectedRow={this.state.editRow}
            />
        })}
        {this.addElement()}
      </Row>
    );
  }
}

