import React, { Component } from "react";
import { connect } from "react-redux";
import SelectField from "material-ui/lib/select-field";
import MenuItem from "material-ui/lib/menus/menu-item";
import TextField from "material-ui/lib/text-field";
import filterCategories from "./filterCategories";
import {
  getUserGroups,
  getUserTypes,
  getCountries,
  getUserRoles,
} from "../../reducers/coreReducers";

class FilterDetail extends Component {
  state = {
    value: "",
  };

  valueChanged = value => {
    this.setState({ value });
    this.props.onChange(value);
  };

  onChangeTextInput = e => {
    this.valueChanged(e.target.value);
  };

  onChangeSelectInput = ({}, {}, value) => {
    this.valueChanged(value);
  };

  render() {
    const { id } = this.props;
    const category = filterCategories[id] || {};

    if (!category.model) {
      return (
        <TextField
          label="value"
          placeholderText="Search text"
          value={this.state.value}
          onChange={this.onChangeTextInput}
          margin="normal"
        />
      );
    }

    let optionComponents = [];
    if (category.model === "userTypes") {
      optionComponents = this.props.userTypes.map((o, i) => (
        <MenuItem key={i} value={o} primaryText={o} checked={o === this.state.value} />
      ));
    } else if (category.model === "orgunit") {
      optionComponents = this.props.countries.map(country => {
        return (
          <MenuItem
            key={country.id}
            value={country.name}
            primaryText={country.name}
            checked={country.name === this.state.value}
          />
        );
      });
    } else if (category.model === "usergroup") {
      optionComponents = this.props.userGroups.map(g => {
        return (
          <MenuItem
            key={g.id}
            value={g.name}
            primaryText={g.name}
            checked={g.name === this.state.value}
          />
        );
      });
    } else if (category.model === "userrole") {
      optionComponents = this.props.userRoles.map(g => {
        return (
          <MenuItem
            key={g.id}
            value={g.name}
            primaryText={g.name}
            checked={g.name === this.state.value}
          />
        );
      });
    }

    return (
      <SelectField
        hintText="Select a value"
        value={this.state.value}
        maxHeight={300}
        autoWidth={true}
        onChange={this.onChangeSelectInput}
        placeholderText="Select a value"
      >
        {optionComponents}
      </SelectField>
    );
  }
}

const mapStateToProps = state => {
  return {
    userGroups: getUserGroups(state),
    userTypes: getUserTypes(state),
    countries: getCountries(state),
    userRoles: getUserRoles(state),
  };
};

export default connect(
  mapStateToProps,
  null
)(FilterDetail);
