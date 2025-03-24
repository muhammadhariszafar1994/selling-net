export class LanguageData {
  language = ""; 

  constructor(lang = "en") {
    this.language = lang;

    let languageObject = {};
    
    languageObject = {...languageObject, ...{columnsDataModules: this.getColumnsDataModules()}};

    return languageObject;
  }

  getColumnsData() {
    return {
      "en": {
        "name": "NAME",
        "description": "DESCRIPTION",
        "price": "PRICE",
        "createdAt": "CREATED AT",
        "updatedAt": "UPDATED AT"
      },
      "ur": {
        "name": "_NAME",
        "description": "_DESCRIPTION",
        "price": "_PRICE",
        "createdAt": "_CREATED AT",
        "updatedAt": "_UPDATED AT"
      }
    };
  }

  getColumnsDataModules() {
    return [
      {
        Header: this.getColumnsData()[this.language]?.name ?? 'Invalid Key',
        accessor: "name",
      },
      {
        Header: this.getColumnsData()[this.language]?.description ?? 'Invalid Key',
        accessor: "description",
      },
      {
        Header: this.getColumnsData()[this.language]?.price ?? 'Invalid Key',
        accessor: "price",
      },
      {
        Header: this.getColumnsData()[this.language]?.createdAt ?? 'Invalid Key',
        accessor: "createdAt",
      },
      {
        Header: this.getColumnsData()[this.language]?.updatedAt ?? 'Invalid Key',
        accessor: "updatedAt",
      },
    ];
  }
}