#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod foobar {
    use ink::prelude::string::String;
    //use ink::storage::Mapping;
    use ink::prelude::vec::Vec;


    // Usar esses depois
    //#[ink(storage)]
    pub struct Database{
        users_list: Vec<User>
    }

    pub struct User{
        id: AccountId,
        travel_list: Vec<Travel>

    }

    pub struct Travel{
        pais: String,
        descricao: String

    }


    #[ink(storage)]
    pub struct Foobar {
        
        pais: String,
        detalhe_viagem: String
    }
    

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