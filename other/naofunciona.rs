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
        
        users_list: Vec<User>
    }
    

    impl Foobar {
        /// Constructor that initializes the bool value to the given init_value.
        #[ink(constructor)]
        pub fn new(pais_string:String, detalhe_viagem_string:String) -> Self {
            Self { 
               user_list: Vec::<User>, 
            }
        }

        #[ink(message)]
        pub fn newEntry(&mut self, pais_target:String,detalhe_viagem:String){
            // iteraçao em users
            for user in self.user_list{
                // check if its the correct user
                if user.AccountId == AccountId {
                    // creating travel reccord
                    let t = Travel {pais_target, detalhe_viagem};
                    t.pais = pais_target;
                    t.descricao = detalhe_viagem;

                    // appending the travel reccord to the user travel list
                    user.travel_list.Append(t);
                }
            }

        }


        /*
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
            */

    }

}