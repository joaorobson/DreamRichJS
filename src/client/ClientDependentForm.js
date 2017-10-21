import React, {Component} from 'react';
import {FormsyText} from 'formsy-material-ui/lib';
import {FormsyDate} from '../utils/FormsyComponents';
import errorMessages from '../utils/FormsErrorMessages';
import ClientSubForm from './ClientSubForm';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Checkbox from 'material-ui/Checkbox';
import CardForms from '../layout/CardForms';

var {
  wordsError,
} = errorMessages;

class ClientDependentForm extends Component {
  constructor(props){
    super(props);
  }

  state = {
    dependents: [],
    key: 0
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
    if (nextProps.parent_id!== undefined) {
      this.setState({id: nextProps.parent_id});
      console.log('update next props state');
    }
  }

  addDependent = () => {
    this.setState({
      dependents: [...this.state.dependents,
        this.state.key],
      key: this.state.key + 1
    });
  }

  removeDependent = (key) => {
    const array = this.state.dependents.slice();
    this.setState({
      dependents: array.filter(e => e !== key),
    });
  }

  getContentCard(){
    return (
      <Row around="xs">
        <Col xs>
          <FormsyText
            name="name"
            validations="isWords"
            validationError={wordsError}
            hintText="Nome do dependente"
            floatingLabelText="Nome"
          />
        </Col>
        <Col xs>
          <FormsyText
            name="surname"
            validations="isWords"
            validationError={wordsError}
            hintText="Sobrenome do dependente"
            floatingLabelText="Sobrenome"
          />
        </Col>
        <Col xs>
          <FormsyDate
            name="birthday"
            floatingLabelText="Data de Nascimento"
          />
        </Col>
      </Row>
    );
  }

  getSelectOption(selectOption,isChecked,labelOption){
    return (
      <Checkbox
        label={labelOption}
        checked={isChecked}
        onClick={selectOption}
        style={{margin: '30px 0px 30px 0px'}}
      />
    );
  }

  render = () => {
    let subtitleCard = 'Insira as informações correspondentes as informações do dependente.';
    let labelAdd='O cliente possui dependentes? (Maque o quadrado ao lado caso haja).';
    let labelRemove='O cliente possui não dependentes? (Desmaque o quadrado ao lado caso não haja).';

    return (
      <div>
        {this.state.dependents.map(e =>
          <div key={e}>
            {this.getSelectOption(this.removeDependent.bind(this, e), true,labelRemove)}
            <ClientSubForm
              name="dependent"
              parent_name='active_client_id'
              parent_id={this.props.parent_id}>
                <CardForms
                  titleCard='Dependentes'
                  subtitleCard={subtitleCard}
                  contentCard={this.getContentCard()}
                />
            </ClientSubForm>
          </div>
        )}

        {this.getSelectOption(this.addDependent, false, labelAdd)}
      </div>
    );
  }
}

export default ClientDependentForm;

ClientDependentForm.propTypes = {
  parent_id: PropTypes.number,
};
