const axios = require('axios');

class MedicineService {
  constructor() {
    this.openFDABaseURL = 'https://api.fda.gov/drug';
    this.rxNormBaseURL = 'https://rxnav.nlm.nih.gov/REST';
  }

  async getMedicineInfo(medicineName) {
    try {
      console.log('Fetching medicine info for:', medicineName);
      const [fdaData, rxNormData] = await Promise.allSettled([
        this.getFDAInfo(medicineName),
        this.getRxNormInfo(medicineName)
      ]);

      return {
        name: medicineName,
        fda: fdaData.status === 'fulfilled' ? fdaData.value : this.getDefaultFDAInfo(medicineName),
        rxnorm: rxNormData.status === 'fulfilled' ? rxNormData.value : this.getDefaultRxNormInfo(medicineName),
        disclaimer: "This information is for educational purposes only. Always consult a licensed healthcare professional."
      };
    } catch (error) {
      console.error('Medicine service error:', error);
      return {
        name: medicineName,
        fda: this.getDefaultFDAInfo(medicineName),
        rxnorm: this.getDefaultRxNormInfo(medicineName),
        disclaimer: "This information is for educational purposes only. Always consult a licensed healthcare professional."
      };
    }
  }

  async getFDAInfo(medicineName) {
    try {
      // Search in FDA drug labels
      const labelResponse = await axios.get(`${this.openFDABaseURL}/label.json`, {
        params: {
          search: `openfda.brand_name:${medicineName} OR openfda.generic_name:${medicineName}`,
          limit: 1
        },
        timeout: 10000
      });

      if (labelResponse.data.results && labelResponse.data.results.length > 0) {
        const result = labelResponse.data.results[0];
        
        return {
          source: "openfda", // ✅ YE LINE ADD KARO
          brandName: result.openfda?.brand_name?.[0] || medicineName,
          genericName: result.openfda?.generic_name?.[0] || 'Not available',
          manufacturer: result.openfda?.manufacturer_name?.[0] || 'Not available',
          indications: result.indications_and_usage?.[0] || 'Not available',
          warnings: result.warnings?.[0] || result.boxed_warning?.[0] || 'Not available',
          adverseReactions: result.adverse_reactions?.[0] || 'Not available',
          dosage: result.dosage_and_administration?.[0] || 'Not available'
        };
      }

      return this.getDefaultFDAInfo(medicineName);
    } catch (error) {
      console.warn('FDA API error:', error.message);
      return this.getDefaultFDAInfo(medicineName);
    }
  }

  async getRxNormInfo(medicineName) {
    try {
      // Search for RxCUI (RxNorm Concept Unique Identifier)
      const searchResponse = await axios.get(`${this.rxNormBaseURL}/drugs.json`, {
        params: { name: medicineName },
        timeout: 10000
      });

      if (searchResponse.data.drugGroup?.conceptGroup) {
        const concepts = searchResponse.data.drugGroup.conceptGroup
          .find(group => group.tty === 'SBD' || group.tty === 'GPCK')?.conceptProperties;

        if (concepts && concepts.length > 0) {
          const rxcui = concepts[0].rxcui;
          
          // Get related information
          const [relatedResponse, ingredientsResponse] = await Promise.allSettled([
            axios.get(`${this.rxNormBaseURL}/rxcui/${rxcui}/related.json`, { 
              params: { tty: 'IN+PIN' },
              timeout: 10000 
            }),
            axios.get(`${this.rxNormBaseURL}/rxcui/${rxcui}/allProperties.json`, {
              params: { prop: 'all' },
              timeout: 10000
            })
          ]);

          return {
            rxcui: rxcui,
            name: concepts[0].name,
            synonym: concepts[0].synonym || 'Not available',
            ingredients: this.extractIngredients(relatedResponse),
            properties: this.extractProperties(ingredientsResponse)
          };
        }
      }

      return this.getDefaultRxNormInfo(medicineName);
    } catch (error) {
      console.warn('RxNorm API error:', error.message);
      return this.getDefaultRxNormInfo(medicineName);
    }
  }

  extractIngredients(relatedResponse) {
    if (relatedResponse.status === 'fulfilled' && relatedResponse.value.data.relatedGroup) {
      const ingredients = relatedResponse.value.data.relatedGroup.conceptGroup
        ?.find(group => group.tty === 'IN')?.conceptProperties;
      
      return ingredients ? ingredients.map(ing => ing.name).join(', ') : 'Not available';
    }
    return 'Not available';
  }

  extractProperties(propertiesResponse) {
    if (propertiesResponse.status === 'fulfilled' && propertiesResponse.value.data.propConceptGroup) {
      const props = propertiesResponse.value.data.propConceptGroup.propConcept || [];
      return props.reduce((acc, prop) => {
        acc[prop.propName] = prop.propValue;
        return acc;
      }, {});
    }
    return {};
  }

  getDefaultFDAInfo(medicineName) {
  return {
    source: "fallback", // ✅ YE LINE ADD KARO
    brandName: medicineName,
    genericName: 'Information not available in FDA database',
    manufacturer: 'Not available',
    indications: 'Please consult a healthcare professional for usage information',
    warnings: 'Always read the medicine label and consult a doctor before use',
    adverseReactions: 'Consult healthcare provider for side effect information',
    dosage: 'Follow prescription or consult healthcare provider'
  };
}


  getDefaultRxNormInfo(medicineName) {
    return {
      rxcui: 'Not found',
      name: medicineName,
      synonym: 'Not available',
      ingredients: 'Information not available in RxNorm database',
      properties: {}
    };
  }
}

module.exports = new MedicineService();