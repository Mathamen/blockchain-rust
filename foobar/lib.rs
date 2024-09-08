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

        lista_relatos: Vec<String>,
        lista_usuarios_relato: Vec<AccountId>
        
    }
    

    impl Foobar {
        /// Constructor that initializes the bool value to the given init_value.
        #[ink(constructor)]
        pub fn new(
            lista_relatos_target: Vec<String>, 
            lista_usuarios_relato_target: Vec<AccountId>
            ) -> Self {
                    Self { 
                        lista_relatos:lista_relatos_target, 
                        lista_usuarios_relato: lista_usuarios_relato_target 
                    }
        }


        #[ink(message)]
        pub fn set_message(
            &mut self, 
            pais_target: String, 
            detalhe_viagem_target: String, 
            estado_viagem: String,
            userid: AccountId) {
        // Combine the new message with existing details
            let mut entrada = pais_target;
            entrada.push_str(";");
            entrada.push_str(&detalhe_viagem_target);

            entrada.push_str(";");
            entrada.push_str(&estado_viagem);
            
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

#[ink(message)]
pub fn fetch(&self) -> String {
    let default_user_id = AccountId::from([0x01; 32]); // Replace with your default AccountId
    let mut retorno = String::new();

    for i in 0..self.lista_usuarios_relato.len() {
        if let Some(user_id) = self.lista_usuarios_relato.get(i) {
            if *user_id == default_user_id {
                if let Some(relato) = self.lista_relatos.get(i) {
                    retorno.push_str(&relato);
                }
            }
        }
    }
    retorno
}



        #[ink(message)]
        pub fn get_message_user_state(&self, userid: AccountId, target_state: String) -> Vec<String> {
            let mut matching_reports = Vec::new();
        
            for i in 0..self.lista_usuarios_relato.len() {
                if let Some(user_id) = self.lista_usuarios_relato.get(i) {
                    if *user_id == userid {
                        if let Some(relato) = self.lista_relatos.get(i) {
                            // Split the message into parts (pais;detalhe;estado)
                            let parts: Vec<&str> = relato.split(';').collect();
                            if parts.len() == 3 {
                                // Check if the state matches the target state
                                if parts[2] == target_state {
                                    matching_reports.push(relato.clone());
                                }
                            }
                        }
                    }
                }
            }
            matching_reports
        }
    }
}