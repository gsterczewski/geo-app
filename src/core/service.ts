import { APIResponse, CountryResponseModel } from "core/types";
import  CountriesAPI  from "./api";
import { Country } from "./country";



export default class CountriesService {
 
  constructor(private api : CountriesAPI){
    this.api = api;
  };
 
  private paginateResponse(response: Country[], pageNumber:number, pageSize:number):Country[] {
    return response.slice(( pageNumber * pageSize) - pageSize , pageNumber * pageSize );
  }
  
  private handleResponse(response: APIResponse<Country[]>, successCallback : (response:CountryResponseModel[]) => Country[]):Country[]{
    if(response.hasErrors){
      console.error(response.error);
      return []
    }
    if(response.result && response.result.length){
      return successCallback(response.result)
    }
    return []
  }
  public async getAllCountries(): Promise<Country[]> {
      
    const response = await this.api.fetchAll("/all?fields=name;capital;population;alpha3Code;flag;region");
    return this.handleResponse(response, (countries) => countries.map(coutryData=> new Country(coutryData)))  
  }
  public async getCountriesByName(nameQuery:string): Promise<Country[]>{
    const request = await this.api.fetchByName(nameQuery);
    return this.handleResponse(request, (countries) => countries.map(coutryData=> new Country(coutryData)))  
  }
}