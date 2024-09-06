#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod foobar {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Foobar {
        
        pais: String,
        detalhe_viagem: String,

        
        lista_relatos: Vec<String>,
        lista_usuarios_relato: Vec<AccountId>
        
    }
    

    impl Foobar {
        /// Constructor that initializes the bool value to the given init_value.
        #[ink(constructor)]
        pub fn new(
            pais_string:String, 
            detalhe_viagem_string:String, 
            lista_relatos_target: Vec<String>, 
            lista_usuarios_relato_target: Vec<AccountId>
            ) -> Self {
                    Self { 
                        pais:pais_string, 
                        detalhe_viagem:detalhe_viagem_string, 
                        lista_relatos:lista_relatos_target, 
                        lista_usuarios_relato: lista_usuarios_relato_target 
                    }
        }

        #[ink(message)]
        pub fn getResult(&self) -> String {
            let mut result = self.pais.clone(); // Clone the first string
            result.push_str(&self.detalhe_viagem); // Append the second string
            return result
        }

        #[ink(message)]
    pub fn set_message(&mut self, pais_target: String, detalhe_viagem_target: String, userid: AccountId) {
    // Combine the new message with existing details
        let mut entrada = pais_target;
        entrada.push_str(&detalhe_viagem_target);

        // Add the combined message to the list of reports
        self.lista_relatos.push(entrada);

        // Associate the user ID with the new report
        self.lista_usuarios_relato.push(userid);
    }


        #[ink(message)]
    pub fn get_message_user(&self, userid: AccountId) -> String {
        let mut retorno = String::new();

        for i in 0..self.lista_usuarios_relato.len() {
            if let Some(user_id) = self.lista_usuarios_relato.get(i) {
                if *user_id == userid {
                    if let Some(relato) = self.lista_relatos.get(i) {
                        retorno.push_str(&relato);
                    }
                }
            }
        }
        retorno
    }

    }
}