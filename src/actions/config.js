export const userTypes = Object.freeze({
  MOH: "MOH",
  Agency: "Agency",
  Global: "Global",
  PartnerDoD: "Partner DoD",
  Partner: "Partner",
  InterAgency: "Inter-Agency",
  AgencyHQ: "Agency HQ",
  Unknown: "Unknown user type",
});

const configuration = {
  [userTypes.Agency]: {
    userTypePriority: 5,
    groupFilter: "^OU .+? Agency ",
    groupSpecifics: [" users$", " user administrators$", " all mechanisms$"],
    actions: [
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Accept Data",
        preSelected: 0,
        roleUID: "QbxXEPw9xlf",
        selectWhenUA: 1,
        sortOrder: 0,
      },
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Submit Data",
        preSelected: 0,
        roleUID: "n777lf1THwQ",
        selectWhenUA: 1,
        sortOrder: 2,
      },
      {
        hidden: 0,
        locked: 1,
        name: "View Unapproved Data",
        preSelected: 1,
        roleUID: "R74PQmVFl6R",
        selectWhenUA: 1,
        sortOrder: 3,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Aggregate",
        preSelected: 0,
        roleUID: "k7BWFXkG6zt",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Tracker",
        preSelected: 0,
        roleUID: "NsYYVxduOTM",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 1,
        name: "Read Only",
        preSelected: 1,
        roleUID: "b2uHwX9YLhu",
        selectWhenUA: 1,
        sortOrder: -1,
      },
    ],
    streams: {
      ER: {
        accessLevels: {
          "Enter Data": {
            groupName: "Data ER entry",
            groupUID: "XgctRYBpSiR",
            impliedRoles: [
              {
                name: "Data Entry Aggregate",
                roleUID: "k7BWFXkG6zt",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data ER access",
            groupUID: "M9Uer9SioL7",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
      },
      MER: {
        accessLevels: {
          "View Data": {
            groupName: "Data PRIME access",
            groupUID: "c6hGi8GEZot",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
        },
        sortOrder: 0,
      },
      MOH: {
        accessLevels: {
          "View Data": {
            groupName: "Data MOH access",
            groupUID: "OoiLAfMTyMx",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
        },
        sortOrder: 2,
      },
      SIMS: {
        accessLevels: {
          "View Data": {
            groupName: "Data SIMS access",
            groupUID: "iuD8wUFz95X",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
        },
        sortOrder: 3,
      },
      SaS: {
        accessLevels: {
          "Enter Data": {
            groupName: "Data SaS entry",
            groupUID: "AZU9Haopetn",
            impliedRoles: [
              {
                name: "Data Entry Tracker",
                roleUID: "NsYYVxduOTM",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data SaS access",
            groupUID: "CwFniyubXbx",
            impliedRoles: [
              {
                name: "Data Entry Tracker",
                roleUID: "NsYYVxduOTM",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
        sortOrder: 4,
      },
    },
    canCreate: ["Agency", "Partner"],
  },
  [userTypes.AgencyHQ]: {
    userTypePriority: 2,
    groupFilter: "^Global Agency ",
    actions: [
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Accept Data",
        preSelected: 0,
        roleUID: "QbxXEPw9xlf",
        selectWhenUA: 1,
        sortOrder: 0,
      },
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Submit Data",
        preSelected: 0,
        roleUID: "n777lf1THwQ",
        selectWhenUA: 1,
        sortOrder: 2,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Aggregate",
        preSelected: 0,
        roleUID: "k7BWFXkG6zt",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 1,
        name: "Read Only",
        preSelected: 1,
        roleUID: "b2uHwX9YLhu",
        selectWhenUA: 1,
        sortOrder: -1,
      },
    ],
    streams: {
      ER: {
        accessLevels: {
          "Enter Data": {
            groupName: "Data ER entry",
            groupUID: "XgctRYBpSiR",
            impliedRoles: [
              {
                name: "Data Entry Aggregate",
                roleUID: "k7BWFXkG6zt",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data ER access",
            groupUID: "M9Uer9SioL7",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
        sortOrder: 1,
      },
    },
    canCreate: ["Agency HQ"],
  },
  [userTypes.Global]: {
    ouUID: "ybg3MO3hcf4",
    userTypePriority: 1,
    groupFilter: "^Global Users",
    actions: [
      {
        hidden: 1,
        locked: 1,
        name: "Read Only",
        preSelected: 1,
        roleUID: "b2uHwX9YLhu",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Tracker",
        preSelected: 0,
        roleUID: "NsYYVxduOTM",
        selectWhenUA: 1,
        sortOrder: -1,
      },
    ],
    streams: {
      ER: {
        accessLevels: {
          "View Data": {
            groupName: "Data ER access",
            groupUID: "M9Uer9SioL7",
            locked: 1,
            preSelected: 1,
            selectWhenUA: 0,
          },
        },
        sortOrder: 1,
      },
      MER: {
        accessLevels: {
          "View Data": {
            groupName: "Data PRIME access",
            groupUID: "c6hGi8GEZot",
            locked: 1,
            preSelected: 1,
            selectWhenUA: 0,
          },
        },
        sortOrder: 0,
      },
      MOH: {
        accessLevels: {
          "View Data": {
            groupName: "Data MOH access",
            groupUID: "OoiLAfMTyMx",
            locked: 1,
            preSelected: 1,
            selectWhenUA: 0,
          },
        },
        sortOrder: 2,
      },
      SIMS: {
        accessLevels: {
          "View Data": {
            groupName: "Data SIMS access",
            groupUID: "iuD8wUFz95X",
            locked: 1,
            preSelected: 1,
            selectWhenUA: 0,
          },
        },
        sortOrder: 3,
      },
      SaS: {
        accessLevels: {
          "View Data": {
            groupName: "Data SaS access",
            groupUID: "CwFniyubXbx",
            impliedRoles: [
              {
                name: "Data Entry Tracker",
                roleUID: "NsYYVxduOTM",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
        },
        sortOrder: 4,
      },
    },
    canCreate: ["Global", "Agency HQ"],
  },
  [userTypes.InterAgency]: {
    userTypePriority: 4,
    groupFilter: "^OU .+? Country team$",
    actions: [
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Accept Data",
        preSelected: 0,
        roleUID: "QbxXEPw9xlf",
        selectWhenUA: 1,
        sortOrder: 0,
      },
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Submit Data",
        preSelected: 0,
        roleUID: "n777lf1THwQ",
        selectWhenUA: 1,
        sortOrder: 1,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Aggregate",
        preSelected: 0,
        roleUID: "k7BWFXkG6zt",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Tracker",
        preSelected: 0,
        roleUID: "NsYYVxduOTM",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 0,
        locked: 0,
        name: "Deduplication",
        preSelected: 0,
        roleUID: "PZAx69RkL9Q",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 1,
        name: "Read Only",
        preSelected: 1,
        roleUID: "b2uHwX9YLhu",
        selectWhenUA: 1,
        sortOrder: -1,
      },
    ],
    streams: {
      "MER Country Team": {
        accessLevels: {
          "Enter Data": {
            groupName: "Data PRIME Country Team entry",
            groupUID: "zY2t7de7Jzz",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data PRIME access",
            groupUID: "c6hGi8GEZot",
            impliedRoles: [
              {
                name: "Data Entry Aggregate",
                roleUID: "k7BWFXkG6zt",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
        sortOrder: 0,
      },
      MOH: {
        accessLevels: {
          "View Data": {
            groupName: "Data MOH access",
            groupUID: "OoiLAfMTyMx",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
        },
        sortOrder: 2,
      },
      SIMS: {
        accessLevels: {
          "View Data": {
            groupName: "Data SIMS access",
            groupUID: "iuD8wUFz95X",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
        },
        sortOrder: 3,
      },
      SaS: {
        accessLevels: {
          "View Data": {
            groupName: "Data SaS access",
            groupUID: "CwFniyubXbx",
            impliedRoles: [
              {
                name: "Data Entry Tracker",
                roleUID: "NsYYVxduOTM",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
        },
        sortOrder: 4,
      },
    },
    canCreate: ["Inter-Agency", "Partner"],
  },
  [userTypes.MOH]: {
    userTypePriority: 8,
    groupFilter: "^Data MOH access$",
    actions: [
      {
        hidden: 1,
        locked: 1,
        name: "Read Only",
        preSelected: 1,
        roleUID: "b2uHwX9YLhu",
        selectWhenUA: 1,
        sortOrder: -1,
      },
    ],
    streams: {
      MOH: {
        accessLevels: {
          "View Data": {
            groupName: "Data MOH access",
            groupUID: "OoiLAfMTyMx",
            locked: 1,
            preSelected: 1,
            selectWhenUA: 1,
          },
        },
        sortOrder: 1,
      },
    },
    canCreate: ["MOH"],
  },
  [userTypes.Partner]: {
    userTypePriority: 7,
    groupFilter: "^OU .+? Partner ",
    groupSpecifics: [
      "^[0-9]* users -",
      "^[0-9]* user administrators -",
      "^[0-9]* all mechanisms -",
    ],
    actions: [
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Submit Data",
        preSelected: 0,
        roleUID: "n777lf1THwQ",
        selectWhenUA: 1,
        sortOrder: 0,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Aggregate",
        preSelected: 0,
        roleUID: "k7BWFXkG6zt",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 1,
        name: "Read Only",
        preSelected: 1,
        roleUID: "b2uHwX9YLhu",
        selectWhenUA: 1,
        sortOrder: -1,
      },
    ],
    streams: {
      ER: {
        accessLevels: {
          "Enter Data": {
            groupName: "Data ER entry",
            groupUID: "XgctRYBpSiR",
            impliedRoles: [
              {
                name: "Data Entry Aggregate",
                roleUID: "k7BWFXkG6zt",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data ER access",
            groupUID: "M9Uer9SioL7",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
        sortOrder: 1,
      },
      MER: {
        accessLevels: {
          "Enter Data": {
            groupName: "Data PRIME entry",
            groupUID: "hCofOhr3q1Q",
            impliedRoles: [
              {
                name: "Data Entry Aggregate",
                roleUID: "k7BWFXkG6zt",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data PRIME access",
            groupUID: "c6hGi8GEZot",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
        sortOrder: 0,
      },
    },
    canCreate: ["Partner"],
  },
  [userTypes.PartnerDoD]: {
    userTypePriority: 6,
    groupFilter: " DoD ",
    groupSpecifics: [
      "^[0-9]* users -",
      "^[0-9]* user administrators -",
      "^[0-9]* all mechanisms -",
    ],
    isDoD: true,
    actions: [
      {
        hidden: 0,
        locked: 0,
        name: "Approvals: Submit Data",
        preSelected: 0,
        roleUID: "n777lf1THwQ",
        selectWhenUA: 1,
        sortOrder: 0,
      },
      {
        hidden: 1,
        locked: 0,
        name: "Data Entry Aggregate",
        preSelected: 0,
        roleUID: "k7BWFXkG6zt",
        selectWhenUA: 1,
        sortOrder: -1,
      },
      {
        hidden: 1,
        locked: 1,
        name: "Read Only",
        preSelected: 1,
        roleUID: "b2uHwX9YLhu",
        selectWhenUA: 1,
        sortOrder: -1,
      },
    ],
    streams: {
      ER: {
        accessLevels: {
          "Enter Data": {
            groupName: "Data ER entry",
            groupUID: "XgctRYBpSiR",
            impliedRoles: [
              {
                name: "Data Entry Aggregate",
                roleUID: "k7BWFXkG6zt",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data ER access",
            groupUID: "M9Uer9SioL7",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
        sortOrder: 1,
      },
      "MER DoD": {
        accessLevels: {
          "Enter Data": {
            groupName: "Data PRIME DoD entry",
            groupUID: "rP0VPKQcC8y",
            impliedRoles: [
              {
                name: "Data Entry Aggregate",
                roleUID: "k7BWFXkG6zt",
              },
            ],
            locked: 0,
            preSelected: 0,
            selectWhenUA: 1,
          },
          "View Data": {
            groupName: "Data PRIME access",
            groupUID: "c6hGi8GEZot",
            locked: 0,
            preSelected: 0,
            selectWhenUA: 0,
          },
        },
        sortOrder: 0,
      },
    },
    canCreate: ["Partner DoD"],
  },
};

export default configuration;
