#![cfg_attr(not(feature = "std"), no_std)]

use ink::prelude::vec::Vec;
use ink::storage::Mapping;

#[ink::contract]
mod user_country_info {
    use super::*;

    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct CountryInfo {
        country: String,
        info: String,
    }

    #[ink(storage)]
    pub struct UserCountryInfo {
        user_data: Mapping<AccountId, Vec<CountryInfo>>,
    }

    impl UserCountryInfo {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                user_data: Mapping::new(),
            }
        }

        #[ink(message)]
        pub fn add_country_info(&mut self, country: String, info: String) {
            let caller = self.env().caller();
            let country_info = CountryInfo { country, info };
            let mut user_countries = self.user_data.get(caller).unwrap_or_default();
            user_countries.push(country_info);
            self.user_data.insert(caller, &user_countries);
        }

        #[ink(message)]
        pub fn get_user_country_info(&self) -> Vec<CountryInfo> {
            let caller = self.env().caller();
            self.user_data.get(caller).unwrap_or_default()
        }

        #[ink(message)]
        pub fn update_country_info(&mut self, index: u32, new_info: String) -> bool {
            let caller = self.env().caller();
            let mut user_countries = self.user_data.get(caller).unwrap_or_default();
            if let Some(country_info) = user_countries.get_mut(index as usize) {
                country_info.info = new_info;
                self.user_data.insert(caller, &user_countries);
                true
            } else {
                false
            }
        }

        #[ink(message)]
        pub fn remove_country_info(&mut self, index: u32) -> bool {
            let caller = self.env().caller();
            let mut user_countries = self.user_data.get(caller).unwrap_or_default();
            if index < user_countries.len() as u32 {
                user_countries.remove(index as usize);
                self.user_data.insert(caller, &user_countries);
                true
            } else {
                false
            }
        }

        #[ink(message)]
        pub fn get_user_countries(&self) -> Vec<String> {
            let caller = self.env().caller();
            self.user_data
                .get(caller)
                .unwrap_or_default()
                .iter()
                .map(|ci| ci.country.clone())
                .collect()
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn add_and_get_country_info_works() {
            let mut contract = UserCountryInfo::new();
            contract.add_country_info("France".into(), "Info about France".into());
            let user_info = contract.get_user_country_info();
            assert_eq!(user_info.len(), 1);
            assert_eq!(user_info[0].country, "France");
            assert_eq!(user_info[0].info, "Info about France");
        }

        #[ink::test]
        fn update_country_info_works() {
            let mut contract = UserCountryInfo::new();
            contract.add_country_info("Germany".into(), "Old info".into());
            assert!(contract.update_country_info(0, "New info".into()));
            let user_info = contract.get_user_country_info();
            assert_eq!(user_info[0].info, "New info");
        }

        #[ink::test]
        fn remove_country_info_works() {
            let mut contract = UserCountryInfo::new();
            contract.add_country_info("Italy".into(), "Info about Italy".into());
            assert!(contract.remove_country_info(0));
            let user_info = contract.get_user_country_info();
            assert_eq!(user_info.len(), 0);
        }

        #[ink::test]
        fn get_user_countries_works() {
            let mut contract = UserCountryInfo::new();
            contract.add_country_info("Spain".into(), "Info about Spain".into());
            contract.add_country_info("Portugal".into(), "Info about Portugal".into());
            let countries = contract.get_user_countries();
            assert_eq!(countries, vec!["Spain".to_string(), "Portugal".to_string()]);
        }
    }
}