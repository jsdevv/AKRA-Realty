import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

const typesense = new TypesenseInstantsearchAdapter({
    server: {
      nodes: [
        {
          host: process.env.REACT_APP_TYPESENSE_HOST ?? 'localhost',
          port: Number(process.env.REACT_APP_TYPESENSE_PORT ?? 8108),
          protocol: process.env.REACT_APP_TYPESENSE_PROTOCOL ?? 'http',
        },
      ],
      apiKey: process.env.REACT_APP_TYPESENSE_SEARCH_API_KEY ?? 'akraTypesenseKey',
      connectionTimeoutSeconds: 2,
    },
    additionalSearchParameters: {
      query_by: 'projectName,propertyName,propertyState,propertyCity,propertyZipCode,propertyCardLine2,propertyCardLine3,propertyAddress1,propertyAddress2,locality',
      limit: 250,
      facet_by: 'propertyStatus,propertyType,projectName,customStatus',
      group_by: 'projectName',
      //group_limit: 1,
    },
    flattenGroupedHits: false,
    geoLocationField: 'location',
  });

export default typesense;
