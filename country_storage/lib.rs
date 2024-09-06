#![cfg_attr(not(feature = "std"), no_std)]

use ink::prelude::*;

#[ink::contract]
pub mod flipper {
    use super::*;

    #[ink(storage)]
    pub struct Flipper {
        value: bool,
    }

    impl Flipper {
        /// Creates a new `Flipper` smart contract initialized with the given value.
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { value: init_value }
        }

        /// Creates a new `Flipper` smart contract initialized to `false`.
        #[ink(constructor)]
        pub fn new_default() -> Self {
            Self::new(Default::default())
        }

        /// Flips the current value of the `Flipper`'s boolean.
        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        /// Returns the current value of the `Flipper`'s boolean.
        #[ink(message)]
        pub fn get(&self) -> bool {
            self.value
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::test;

        #[test]
        fn default_works() {
            let flipper = Flipper::new_default();
            assert!(!flipper.get());
        }

        #[test]
        fn it_works() {
            let mut flipper = Flipper::new(false);
            assert!(!flipper.get());
            flipper.flip();
            assert!(flipper.get());
        }
    }

    #[cfg(all(test, feature = "e2e-tests"))]
    mod e2e_tests {
        use super::*;
        use ink_e2e::{Client, E2EBackend, ContractsBackend};
        use ink_e2e::AccountId;

        type E2EResult<T> = std::result::Result<T, Box<dyn std::error::Error>>;

        #[ink_e2e::test]
        async fn it_works<Client: E2EBackend>(mut client: Client) -> E2EResult<()> {
            // given
            let constructor = Flipper::new(false);
            let contract = client
                .instantiate("flipper", &ink_e2e::alice(), &constructor)
                .submit()
                .await
                .expect("instantiate failed");

            let mut call_builder = contract.call_builder::<Flipper>();

            // when
            let get = call_builder.get();
            let get_res = client.call(&ink_e2e::bob(), &get).dry_run().await?;
            assert_eq!(get_res.return_value(), false);

            let flip = call_builder.flip();
            let _flip_res = client
                .call(&ink_e2e::bob(), &flip)
                .submit()
                .await
                .expect("flip failed");

            // then
            let get = call_builder.get();
            let get_res = client.call(&ink_e2e::bob(), &get).dry_run().await?;
            assert_eq!(get_res.return_value(), true);

            Ok(())
        }

        #[ink_e2e::test]
        async fn default_works<Client: E2EBackend>(mut client: Client) -> E2EResult<()> {
            // given
            let constructor = Flipper::new_default();

            // when
            let contract = client
                .instantiate("flipper", &ink_e2e::bob(), &constructor)
                .submit()
                .await
                .expect("instantiate failed");

            let call_builder = contract.call_builder::<Flipper>();

            // then
            let get = call_builder.get();
            let get_res = client.call(&ink_e2e::bob(), &get).dry_run().await?;
            assert_eq!(get_res.return_value(), false);

            Ok(())
        }

        #[ink_e2e::test]
        #[ignore]
        async fn e2e_test_deployed_contract<Client: E2EBackend>(
            mut client: Client,
        ) -> E2EResult<()> {
            // given
            let addr = std::env::var("CONTRACT_HEX")
                .unwrap()
                .replace("0x", "");
            let acc_id = hex::decode(addr).unwrap();
            let acc_id = AccountId::try_from(&acc_id[..]).unwrap();

            // when
            let call_builder = ink_e2e::create_call_builder::<Flipper>(acc_id);
            let get = call_builder.get();
            let get_res = client.call(&ink_e2e::bob(), &get).dry_run().await?;

            // then
            assert_eq!(get_res.return_value(), true);
            Ok(())
        }
    }
}
