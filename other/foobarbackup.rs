![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod foobar {
    use ink::prelude::string::String;

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Foobar {
        
        pais: String,
        detalhe_viagem: String
    }
    pub struct user

    impl Foobar {
        /// Constructor that initializes the bool value to the given init_value.
        #[ink(constructor)]
        pub fn new(pais_string:String, detalhe_viagem_string:String) -> Self {
            Self { pais:pais_string, detalhe_viagem:detalhe_viagem_string }
        }

        #[ink(message)]
        pub fn getResult(&self) -> String {
            let mut result = self.pais.clone(); // Clone the first string
            result.push_str(&self.detalhe_viagem); // Append the second string
            return result
        }

        #[ink(message)]
        pub fn set_message(&mut self, pais_target:String, detalhe_viagem_target:String){
            self.pais = pais_target;
            self.detalhe_viagem = detalhe_viagem_target;
        }

    }

}