import React, { Component } from "react";
// import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

// import AccessDenied from "./AccessDenied.component";
import DataStream from "./DataStream.component";
import DataAction from "./DataAction.component";
// import AppTheme from "../colortheme";
import actions from "../actions";

class Invite extends Component {
  //   props: Props;

  //   propTypes: {
  //     d2: React.PropTypes.object,
  //     showProcessing: PropTypes.func.isRequired,
  //   };

  contextTypes: {
    d2: React.PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { showProcessing } = this.props;
    showProcessing();

    this.state = {
      userType: false,
      country: false,
      email: "",
      locale: "en",
      agencies: [],
      partners: [],
      agency: false,
      partner: false,
      streams: {},
      actions: {},
      userManager: false,
      accessDenied: false,
    };
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeCountry = this.handleChangeCountry.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeLocale = this.handleChangeLocale.bind(this);
    this.handleChangeAgency = this.handleChangeAgency.bind(this);
    this.handleChangePartner = this.handleChangePartner.bind(this);
    this.handleCheckUserManager = this.handleCheckUserManager.bind(this);
    this.handleChangeStream = this.handleChangeStream.bind(this);
    this.handleChangeActions = this.handleChangeActions.bind(this);
  }

  componentDidMount() {
    // make sure my auth properties have been loaded.
    // Probably haven't yet, so we check in componentDidUpdate as well
    if (this.props.core.me.hasAllAuthority || false) {
      this.secCheck();
    }
  }

  componentDidUpdate(prevProps) {
    // make sure my auth properties have been loaded
    if (this.props.core.me !== prevProps.core.me) {
      this.secCheck();
      // preselect the user's first country
      // console.log('My country:',this.props.core.me.organisationUnits[0].id);
      // this.setState({country: this.props.core.me.organisationUnits[0].id})
      // preselect the user type
    }
  }

  secCheck() {
    const { core, hideProcessing, denyAccess } = this.props;
    // access check super user
    if (!core.me.hasAllAuthority() && !core.me.isUserAdministrator()) {
      hideProcessing();
      denyAccess(
        "Your user account does not seem to have the authorities to access this functionality."
      );
      console.warn(
        "This user is not a user administrator",
        core.me.hasAllAuthority(),
        core.me.isUserAdministrator()
      );
      return;
    }

    // Figure out this user's relevant userGroups
    const userGroups = core.me.userGroups || [];
    const userTypesArr = Object.keys(core.config).map(function(key) {
      let obj = core.config[key];
      obj.name = key;
      return obj;
    });
    const myStreams = userTypesArr.filter(ut => {
      return userGroups.some(ug => {
        return new RegExp(ut.groupFilter, "i").test(ug.name);
      });
    });

    // Make sure they have at least one relevant userGroup stream
    if (!core.me.hasRole("Superuser ALL authorities") || myStreams.length <= 0) {
      hideProcessing();
      denyAccess(
        "Your user account does not seem to have access to any of the data streams."
      );
      console.warn("No valid streams. I have access to ", userGroups);
      return;
    }

    hideProcessing();
  }

  // Get all user groups with (DATIM) in their name
  getDatimUserGroups = async () => {
    const d2 = this.props.d2;
    let list = await d2.models.userGroups.list({
      filter: "name:like: (DATIM)",
      fields: "id,name,users[id,name]",
    });
    return list;
  };

  // merge together userGroups based upon their cogs ID (for agencies and partners)
  extendObj = (obj, userGroup, name, groupType) => {
    return (function() {
      obj[name] = obj[name] || {};
      obj[name][groupType] = userGroup;
      return obj;
    })();
  };

  // get a list of relevant Partners based upon the selected "country"
  // for some reason "Partners" are both userGroups and categoryOptionGroups
  getPartnersInOrg(ouUID) {
    const { core, d2 } = this.props;
    const countryName = core.countries.filter(r => r.id === ouUID)[0].name;
    const params = {
      paging: false,
      fields: "id,name,code",
      filter: "name:ilike:" + countryName + " Partner",
    };

    d2.models.userGroups
      .list(params)
      .then(res => {
        // these two functions are copied from the original stores.json
        // extract the partner code in  format of categoryOptionGroups "Partner_XXXX"
        let getPartnerCode = userGroup => {
          return (/Partner \d+?(?= )/i.exec(userGroup.name) || "")
            .toString()
            .replace("Partner ", "Partner_");
        };
        // figure out the user group type based on the naming convention
        let getType = userGroup => {
          return / all mechanisms - /i.test(userGroup.name)
            ? "mechUserGroup"
            : / user administrators - /i.test(userGroup.name)
              ? "userAdminUserGroup"
              : "userUserGroup";
        };

        // take the userGroups that have a name like our OU, group and index them by their partner_code
        const merged = res.toArray().reduce((obj, ug) => {
          return this.extendObj(obj, ug.toJSON(), getPartnerCode(ug), getType(ug));
        }, {});
        // shove that data into the main partners object
        const mapped = core.partners.map(p => {
          return Object.assign({}, p, merged[p.code]);
        });
        // remove any that didn't get mapped and sort
        let filtered = mapped
          .filter(
            p =>
              p.mechUserGroup &&
              p.mechUserGroup.id &&
              p.userUserGroup &&
              p.userUserGroup.id
          )
          .sort((a, b) => {
            return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
          });
        // check for DoD silliness
        filtered.forEach(p => {
          p.dodEntry = (core.dod[ouUID] || {})[p.id] || false; // will be false, 0, or 1
          p.normalEntry = p.dodEntry === false; // no DoD information
        });
        this.setState({ partners: filtered });
      })
      .catch(e => {
        actions.showSnackbarMessage("Error fetching partner organizations");
        console.error(e);
      });
  }

  // get a list of relevant Agencies for this OU/Country
  getAgenciesInOrg(ouUID) {
    const { core, d2 } = this.props;
    const countryName = core.countries.filter(r => r.id === ouUID)[0].name;
    const params = {
      paging: false,
      fields: "id,name,code",
      filter: "name:ilike:" + countryName + " Agency",
    };
    d2.models.userGroups
      .list(params)
      .then(res => {
        // these two functions are copied from the original stores.json
        // extract the agency code in  format of categoryOptionGroups "Agency_XXXX"
        let getAgencyCode = userGroup => {
          return (/Agency .+?(?= all| user)/i.exec(userGroup.name) || "")
            .toString()
            .replace("Agency ", "Agency_");
        };
        // figure out the user group type based on the naming convention
        let getType = userGroup => {
          return /all mechanisms$/i.test(userGroup.name)
            ? "mechUserGroup"
            : /user administrators$/i.test(userGroup.name)
              ? "userAdminUserGroup"
              : "userUserGroup";
        };

        // take the userGroups that have a name like our OU, group and index them by their partner_code
        const merged = res.toArray().reduce((obj, ug) => {
          return this.extendObj(obj, ug.toJSON(), getAgencyCode(ug), getType(ug));
        }, {});
        // shove that data into the main partners object
        const mapped = core.agencies.map(a => {
          return Object.assign({}, a, merged[a.code]);
        });
        // remove any that didn't get mapped and sort
        let filtered = mapped
          .filter(
            a =>
              a.mechUserGroup &&
              a.mechUserGroup.id &&
              a.userUserGroup &&
              a.userUserGroup.id
          )
          .sort((a, b) => {
            return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
          });
        this.setState({ agencies: filtered });
      })
      .catch(e => {
        actions.showSnackbarMessage("Error fetching agencies");
        console.error(e);
      });
  }

  // figure out which streams should be pre-selected
  getStreamDefaults = (userType, isUserAdmin) => {
    // get the streams for this userType
    if (!userType) {
      return;
    }
    const { core } = this.props;
    const cfg = core.config;
    if (!cfg[userType]) {
      return;
    }

    const cfgStreams = cfg[userType].streams;
    // placeholder for the results
    let streams = {};
    // figure out which permission is the default
    Object.keys(cfgStreams).forEach(key => {
      const access = cfgStreams[key].accessLevels || {};
      const view = access["View Data"] || false;
      const enter = access["Enter Data"] || false;
      if (view) {
        if (view.preSelected === 1 || (isUserAdmin && view.selectWhenUA === 1)) {
          streams[key] = "View Data";
        }
      }
      if (enter) {
        if (enter.preSelected === 1 || (isUserAdmin && enter.selectWhenUA === 1)) {
          streams[key] = "Enter Data";
        }
      }
    });

    return streams;
  };

  // determine preselected User Actions
  getActionDefaults = (userType, isUserAdmin) => {
    // get the streams for this userType
    if (!userType) {
      return;
    }
    const { core } = this.props;
    const cfg = core.config;
    if (!cfg[userType]) {
      return;
    }

    const cfgActions = cfg[userType].actions;
    // placeholder for the results
    let actions = {};
    cfgActions.forEach(action => {
      if (action.preSelected === 1 || (isUserAdmin && action.selectWhenUA === 1)) {
        actions[action.roleUID] = true;
      }
    });
    return actions;
  };

  handleChangeCountry = event => {
    const { core } = this.props;
    this.setState({ [event.target.name]: event.target.value });
    //   this.setState({ country: value, streams: [], actions: [] });
    if (event.target.value === core.config.Global.ouUID) {
      this.handleChangeType(event, 0, "Global");
      this.setState({
        userType: "Global",
        agency: false,
        partner: false,
        streams: this.getStreamDefaults("Global", this.state.userManager),
        actions: this.getActionDefaults("Global", this.state.userManager),
      });
    } else {
      this.setState({
        userType: false,
        agency: false,
        partner: false,
        streams: {},
        actions: {},
      });
    }
  };

  handleChangeType = event => {
    if (this.state.country !== false) {
      switch (event.target.value) {
        case "Agency":
          this.getAgenciesInOrg(this.state.country);
          break;
        case "Partner":
          this.getPartnersInOrg(this.state.country);
          break;
        case "Partner DoD":
          // @TODO
          break;
        case "Global":
        case "Inter-Agency":
        case "MOH":
        default:
          break;
      }
    }
    this.setState({
      userType: event.target.value,
      agency: false,
      partner: false,
      streams: this.getStreamDefaults(event.target.value, this.state.userManager),
      actions: this.getActionDefaults(event.target.value, this.state.userManager),
    });
  };

  handleChangeLocale = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeAgency = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangePartner = event => {
    // check if we need to add DoD objects to view
    let userType = "Partner";
    if (event.target.value !== false) {
      const partner = this.state.partners.filter(f => f.id === event.target.value);
      if (partner.length === 0) {
        console.error("Invalid partner selection");
      } else if (partner[0].normalEntry === false) {
        userType = "Partner DoD";
      }
    }

    this.setState({
      [event.target.name]: event.target.value,
      streams: this.getStreamDefaults(userType, this.state.userManager),
    });
  };

  handleChangeEmail = event => {
    this.setState({ email: event.target.value });
  };

  handleCheckUserManager = () => {
    let um = !this.state.userManager;
    let userType = this.state.userType;

    // check if we need to add DoD objects to view
    if (userType === "Partner") {
      const partner = this.state.partners.filter(f => f.id === this.state.partner);
      if (partner.length === 0) {
        console.error("Invalid partner selection");
      } else if (partner[0].normalEntry === false) {
        userType = "Partner DoD";
      }
    }

    this.setState({
      userManager: um,
      streams: this.getStreamDefaults(userType, um),
      actions: this.getActionDefaults(userType, um),
    });
  };

  // what to do when a radio button is clicked
  handleChangeStream = (streamName, streamState) => {
    let streams = this.state.streams;
    // They don't want access so remove it
    if (streams[streamName] && streamState === "noaccess") {
      delete streams[streamName];
    } else {
      streams[streamName] = streamState;
    }
    this.setState({ streams: streams });
  };

  // what to do when a User Actions checkbox is clicked
  handleChangeActions = (roleUID, value) => {
    let actions = this.state.actions;
    if (actions[roleUID] && value === true) {
      delete actions[roleUID];
    } else {
      actions[roleUID] = value;
    }
    this.setState({ actions: actions });
  };

  // the big todo
  handleInviteUser = () => {
    const { d2, core, showProcessing, hideProcessing } = this.props;
    const cfg = core.config[this.state.userType];
    // start the Processing spinner
    showProcessing();

    let ouUID = this.state.country;

    let user = {};
    user.firstName = "(TBD)";
    user.surname = "(TBD)";
    user.email = this.state.email;
    user.userCredentials = {
      userRoles: [],
    };
    user.organisationUnits = [{ id: ouUID }];
    user.userGroups = []; //Global users
    user.dataViewOrganisationUnits = [{ id: ouUID }];

    // streams / groups
    Object.keys(this.state.streams).forEach(stream => {
      const s = cfg.streams[stream].accessLevels[this.state.streams[stream]];
      user.userGroups.push({ id: s.groupUID });
      // some groups have necessary roles
      if (s.impliedRoles) {
        s.impliedRoles.forEach(r => {
          user.userCredentials.userRoles.push({ id: r.roleUID });
        });
      }
    });

    // actions / roles checkboxes
    Object.keys(this.state.actions).forEach(roleUID => {
      user.userCredentials.userRoles.push({ id: roleUID });
    });

    const api = d2.Api.getApi();
    const locale = this.state.locale;

    // POST to /users/invite
    // @TODO:: progress circle
    api
      .post("/users/invite", user)
      .then(promise => {
        if (promise.errorReports) {
          // something went wrong
          actions.showSnackbarMessage("Invitation Failure: code 100");
          console.error("Invitation Failure", promise.errorReports);
          hideProcessing();
          return;
        }
        // capture the response.uid
        if (!promise.uid) {
          actions.showSnackbarMessage("Invitation Failure: code 200");
          console.error("Invitation Failure", "Missing UID", promise);
          hideProcessing();
          return;
        }
        // get the newly created user object
        d2.models.users
          .get(promise.uid, { fields: ":owner,userCredentials[:owner]" })
          .then(newUser => {
            // set up their locale
            if (newUser.userCredentials && newUser.userCredentials.username) {
              // save user locale
              const url =
                //api.api.baseUrl +
                "/api/29/userSettings/keyUiLocale?user=" +
                newUser.userCredentials.username;
              // POST userSettings/keyUiLocale
              fetch(url, {
                method: "POST",
                cache: "no-cache",
                credentials: "same-origin",
                headers: { "Content-Type": "text/plain" },
                redirect: "follow",
                body: locale,
              })
                .then(response => {
                  if (response.ok && response.ok === true) {
                    actions.showSnackbarMessage("Invitation successfully sent");
                  } else {
                    actions.showSnackbarMessage(
                      "Invitation sent but there was an error setting their locale"
                    );
                    console.error("Error setting locale", response.body);
                    hideProcessing();
                  }
                })
                .catch(e => {
                  actions.showSnackbarMessage(
                    "Invitation sent but there was an error setting their locale"
                  );
                  console.error("Error setting locale", e);
                  hideProcessing();
                });
            } else {
              actions.showSnackbarMessage(
                "Invitation error: Bad user creation: code 500"
              );
              console.error("Invitation error", "Bad user creation", newUser);
              hideProcessing();
            }
          })
          .catch(e => {
            actions.showSnackbarMessage("Invitation error: code 600");
            console.error("Invitation error", e);
            hideProcessing();
          });
      })
      .catch(e => {
        actions.showSnackbarMessage("Invitation error: code 700");
        console.error("Invitation error", e);
        hideProcessing();
      });
  };

  render() {
    const { core } = this.props;
    const myOUs = core.me.organisationUnits.map(ou => ou.id);

    let uts = [];
    let countries = [];
    let locales = [];
    let isGlobalUser = myOUs.indexOf(core.config.Global.ouUID) < 0;

    if (core) {
      // determine what countries they can see
      if (core.countries) {
        countries = core.countries;
        // toss "Global" onto the front of the OU list
        if (countries && countries[0] && countries[0].id !== core.config.Global.ouUID) {
          countries.unshift({ id: core.config.Global.ouUID, name: "Global" });
        }
        // filter out all countries this user does not have access to
        // if they have Global access, let them see everything
        if (isGlobalUser) {
          countries = countries.filter(c => myOUs.indexOf(c.id) < 0);
        }
      }

      // determine what userTypes they can see
      uts = core.userTypes;

      // get the dhis2 ui locales to pick from
      if (core.locales) {
        locales = core.locales;
      }
    } else {
      //BAD CORE CONFIG @TODO:: redirect with warning
    }

    let typeMenus = [];
    uts.forEach(userType => {
      // don't show "Partner DoD" as an option here
      if (core.config[userType].isDoD) {
        return;
      }
      typeMenus.push(
        <MenuItem
          key={userType}
          value={userType}
          disabled={
            this.state.country === core.config.Global.ouUID ||
            (userType === "Global" && this.state.country !== core.config.Global.ouUID) ||
            !this.state.country
          }
        >
          {userType}
        </MenuItem>
      );
    });

    // Build the select menus
    const countryMenus = countries.map(v => (
      <MenuItem key={v.id} value={v.id}>
        {v.name}
      </MenuItem>
    ));

    const localeMenus = locales.map(v => (
      <MenuItem key={v.locale} value={v.locale}>
        {v.name}
      </MenuItem>
    ));

    const agencyMenus = this.state.agencies.map(v => (
      <MenuItem key={v.id} value={v.id}>
        {v.name}
      </MenuItem>
    ));

    const partnerMenus = this.state.partners.map(v => (
      <MenuItem key={v.id} value={v.id}>
        {v.name}
      </MenuItem>
    ));

    // Build the Stream / Action radios
    let streams = [];
    let actions = [];
    if (core.config.hasOwnProperty(this.state.userType)) {
      let cfg = core.config[this.state.userType];

      // Check for DoD awareness
      if (this.state.userType === "Partner" && this.state.partner) {
        // does the selected partner have DoD info
        const partner =
          this.state.partners.filter(p => {
            return p.id === this.state.partner;
          })[0] || {};

        if (partner.hasOwnProperty("normalEntry") && partner.normalEntry !== true) {
          cfg = core.config["Partner DoD"];
        }
      }

      //convert streams to array for easier sorting
      const s = Object.entries(cfg.streams)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => a.value.sortOrder > b.value.sortOrder);
      s.forEach(stream => {
        // add each stream/group to the view
        streams.push(
          <GridListTile key={stream.key}>
            <DataStream
              stream={stream}
              selected={this.state.streams[stream.key] || "noaccess"}
              onChangeStream={this.handleChangeStream}
              userManager={this.state.userManager}
            />
          </GridListTile>
        );
      });
      //get only the visible actions for checkbox display
      const act = cfg.actions
        .filter(a => a.hidden === 0)
        .sort((a, b) => a.sortOrder > b.sortOrder);
      act.forEach(action => {
        actions.push(
          <DataAction
            key={action.roleUID}
            action={action}
            checked={this.state.actions[action.roleUID] || false}
            onChangeAction={this.handleChangeActions}
            userManager={this.state.userManager}
          />
        );
      });
    }

    return (
      <div className="wrapper">
        <h2 className="title">Invite</h2>
        <h3 className="subTitle">User Management</h3>

        <Paper className="card filters">
          <FormControl required style={{ width: "100%", marginTop: "1em" }}>
            <InputLabel htmlFor="country">Country</InputLabel>
            <Select
              value={this.state.country || ""}
              onChange={this.handleChangeCountry}
              inputProps={{
                name: "country",
                id: "country",
              }}
            >
              {countryMenus}
            </Select>
            <FormHelperText>Select a country</FormHelperText>
          </FormControl>

          <FormControl required style={{ width: "100%", marginTop: "1em" }}>
            <InputLabel htmlFor="userType">User Type</InputLabel>
            <Select
              value={this.state.userType || ""}
              onChange={this.handleChangeType}
              inputProps={{
                name: "userType",
                id: "userType",
              }}
            >
              {typeMenus}
            </Select>
            <FormHelperText>Select a user type</FormHelperText>
          </FormControl>

          {this.state.userType === "Partner" ? (
            <FormControl required style={{ width: "100%", marginTop: "1em" }}>
              <InputLabel htmlFor="partner">Partner</InputLabel>
              <Select
                value={this.state.partner || ""}
                onChange={this.handleChangePartner}
                inputProps={{
                  name: "partner",
                  id: "partner",
                }}
              >
                {partnerMenus}
              </Select>
              <FormHelperText>Select a partner</FormHelperText>
            </FormControl>
          ) : null}

          {this.state.userType === "Agency" ? (
            <FormControl required style={{ width: "100%", marginTop: "1em" }}>
              <InputLabel htmlFor="agency">Agency</InputLabel>
              <Select
                value={this.state.agency || ""}
                onChange={this.handleChangeAgency}
                inputProps={{
                  name: "agency",
                  id: "agency",
                }}
              >
                {agencyMenus}
              </Select>
              <FormHelperText>Select an agency</FormHelperText>
            </FormControl>
          ) : null}

          <FormControl required style={{ width: "100%", marginTop: "1em" }}>
            <TextField
              id="email"
              label="E-mail address"
              placeholder="user@organisation.tld"
              onChange={this.handleChangeEmail}
            />
          </FormControl>

          <FormControl required style={{ width: "100%", marginTop: "1em" }}>
            <InputLabel htmlFor="locale">Language</InputLabel>
            <Select
              value={this.state.locale || ""}
              onChange={this.handleChangeLocale}
              inputProps={{
                name: "locale",
                id: "locale",
              }}
            >
              {localeMenus}
            </Select>
            <FormHelperText>Select a language</FormHelperText>
          </FormControl>

          <FormControlLabel
            style={{ marginTop: "1em" }}
            control={
              <Checkbox
                checked={this.state.userManager || false}
                onChange={this.handleCheckUserManager}
                disabled={!this.state.userType}
                value="checkedA"
              />
            }
            label="User Manager"
          />
        </Paper>

        <Paper className="card streams">
          <h3>Data Streams</h3>
          <GridList
            style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}
            cols={streams.length}
          >
            {streams.length > 0 ? streams : <p>None</p>}
          </GridList>
        </Paper>

        <Paper className="card actions">
          <h3>User Actions</h3>
          {actions.length > 0 ? actions : <p>None</p>}
        </Paper>

        <Button
          variant="contained"
          color="primary"
          style={{ display: "block", padding: "0 18em" }}
          disabled={!this.state.country || !this.state.userType || !this.state.email}
          onClick={this.handleInviteUser}
        >
          Invite
        </Button>
      </div>
    );
  }
}

export default Invite;