import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ClientSubForm from './ClientSubForm';
import makeFormysTextList from '../utils/MakeFormysTextList';
import errorMessages from '../utils/FormsErrorMessages';
import { Row, Col } from 'react-flexbox-grid';
import CardForms from '../layout/CardForms';


var {
  wordsError,
  numericError,
} = errorMessages;

const dataAddressSubForm = [
  {
    name: 'cep',validations: 'isNumeric', validationError: numericError,
    hintText: 'Apenas números', floatingLabelText: 'CEP', isUpdate: 'true',
  },
  {
    name: 'details',validations: 'isWords', validationError: wordsError,
    hintText: 'Detalhes do endereço', floatingLabelText: 'Detalhes',
  },
  {
    name: 'number',validations: 'isNumeric', validationError: numericError,
    hintText: 'Número do lote', floatingLabelText: 'Número', isUpdate: 'true',
  },
  {
    name: 'complement',validations: 'isWords', validationError: wordsError,
    hintText: 'Complemento do endereço', floatingLabelText: 'Complemento',
  },
  {
    name: 'neighborhood',validations: 'isWords', validationError: wordsError,
    hintText: 'Bairro do endereço', floatingLabelText: 'Bairro',
  },
  {
    name: 'type_of_address',validations: 'isWords', validationError: wordsError,
    hintText: 'Casa, apartamento, etc.', floatingLabelText: 'Tipo de Endereço',
  },
];

export default class ClientAddressForm extends Component {
  constructor(props){
    super(props);
  }

  getContentCard(){
    const formysTextList = makeFormysTextList(dataAddressSubForm,'adressform');

    return (
      <div>
        <Row>
          <Col xs>
            {formysTextList[0]}
          </Col>
          <Col xs>
            {formysTextList[1]}
          </Col>
          <Col xs>
            {formysTextList[2]}
          </Col>
        </Row>
        <Row>
          <Col xs>
            {formysTextList[3]}
          </Col>
          <Col xs>
            {formysTextList[4]}
          </Col>
          <Col xs>
            {formysTextList[5]}
          </Col>
        </Row>
      </div>
    );
  }

  render = () => {

    return (
      <ClientSubForm
        name='address'
        parent_name='active_client_id'
        parent_id={this.props.id}
      >
        <CardForms
          titleCard="Endereço"
          subtitleCard="Insira as informações correspondentes ao endereço."
          contentCard={this.getContentCard()}
        />
      </ClientSubForm>

    );
  }
}

ClientAddressForm.propTypes = {
  id: PropTypes.number,
};
