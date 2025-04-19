![](media/header.png)

> [!NOTE]  
> In addition to this Vue demo of ic-siws, there are more versions, for React etc. Check out the
> main package [ic-siws](https://github.com/kristoferlund/ic-siws) for more information.

✅ Sign in with Solana to interact with smart contracts (canisters) on the [Internet Computer](https://internetcomputer.org) (IC)!

✅ Establish a one-to-one relationship between a Solana wallet and an IC identity.

✅ Access the IC capabilities from Solana dapp frontends, create cross-chain dapps! Some of the features IC provide are:

- Native integration with BTC and ETH
- Twin tokens (ckBTC, ckETH)
- Fast finality
- Low transaction fees
- HTTPS outcalls
- Store large amounts of data cheaply
- etc

This **Vue** demo application and template demonstrates how to login Solana users into an IC canister using [ic-siws-js](https://www.npmjs.com/package/ic-siws-js) and the [ic-siws-provider](https://github.com/kristoferlund/ic-siws/tree/main/packages/ic_siws_provider) canister.

The goal of the [ic-siws](https://github.com/kristoferlund/ic-siws) project is to enhance the interoperability between Solana and the Internet Computer platform, enabling developers to build applications that leverage the strengths of both platforms.

## 👀 Try the live demo: <https://kmevj-wiaaa-aaaal-qsggq-cai.icp0.io>

## Key features

The demo is built using [Vite](https://vitejs.dev/) to provide a fast development experience.

## Table of contents

- [App components](#app-components)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [IC SIWS Provider](#ic-siws-provider)
- [How it works](#how-it-works)
- [Run locally](#run-locally)
- [Details](#details)
  - [IC SIWS Provider](#ic-siws-provider-1)
  - [Backend](#backend-1)
  - [Frontend](#frontend-1)
    - [SiwsIdentityProvider](#siwsidentityprovider)
    - [AuthGuard](#authguard)
    - [useSiwsIdentity](#usesiwsidentity)
- [Updates](#updates)
- [Contributing](#contributing)
- [License](#license)

## App components

If you are new to IC, please read the [Internet Computer Basics](https://internetcomputer.org/basics) before proceeding.

This app consists of three main components:

### Backend

The backend is a Rust based canister that, for demonstration purposes, implements some basic functionality for managing user profiles.

### Frontend

The frontend is a Vue application that interacts with the backend canister. To be able to make authenticated calls to the backend canister, the frontend needs to have an identity.

### IC SIWS Provider

The pre-built IC SIWS Provider is used to create an identity for the user. It is a Rust based canister that implements the SIWS login flow. The flow starts with a SIWS message being generated and ends with a Delegate Identity being created for the user. The Delegate Identity gives the user access to the backend canister.

## How it works

This is the high-level flow between the app components when a user logs in:

1. The application requests a SIWS message from the `ic_siws_provider` canister on behalf of the user.
2. The application displays the SIWS message to the user who signs it with their Solana wallet.
3. The application sends the signed SIWS message to the `ic_siws_provider` canister to login the user. The canister verifies the signature and creates an identity for the user.
4. The application retrieves the identity from the `ic_siws_provider` canister.
5. The application can now use the identity to make authenticated calls to the app canister.

![Sign in with Solana - Login flow](/media/flow.png)

## Run locally

```bash
dfx start --clean --background
make deploy-all
```

## Details

### IC SIWS Provider

The `ic_siws_provider` canister is pre-built and added to the project as a dependency in the [dfx.json](/dfx.json) file.

```json
{
  "canisters": {
    "ic_siws_provider": {
      "type": "custom",
      "candid": "https://github.com/kristoferlund/ic-siws/releases/download/v0.1.1/ic_siws_provider.did",
      "wasm": "https://github.com/kristoferlund/ic-siws/releases/download/v0.1.1/ic_siws_provider.wasm.gz"
    },
    ...
  },
  ...
}
```

Its behavior is configured and passed as an argument to the canister `init` function. Below is an example of how to configure the canister using the `dfx` command line tool in the project [Makefile](/Makefile):

```makefile
dfx deploy ic_siws_provider --argument "( \
    record { \
        domain = \"127.0.0.1\"; \
        uri = \"http://127.0.0.1:5173\"; \
        salt = \"salt\"; \
        chain_id = opt 1; \
        scheme = opt \"http\"; \
        statement = opt \"Login to the app\"; \
        sign_in_expires_in = opt 300000000000; /* 5 minutes */ \
        session_expires_in = opt 604800000000000; /* 1 week */ \
        targets = opt vec { \
            \"$$(dfx canister id ic_siws_provider)\"; \
            \"$$(dfx canister id backend)\"; \
        }; \
    } \
)"
```

For more information about the configuration options, see the [ic-siws-provider](https://github.com/kristoferlund/ic-siws/tree/main/packages/ic_siws_provider) documentation.

### Backend

The backend is a Rust based canister that, for demonstration purposes, implements some basic functionality for managing user profiles. It is also given an init argument - the `ic_siws_provider` canister id - to be able to verify the identity of the user.

```makefile
dfx deploy backend --argument "$$(dfx canister id ic_siws_provider)"
```

### Frontend

The frontend is a Vue application that interacts with the backend canister. To be able to make authenticated calls to the backend canister, the frontend needs an identity. The identity is retrieved from the `ic_siws_provider` canister.

## Updates

See the [CHANGELOG](CHANGELOG.md) for details on updates.

## Contributing

Contributions are welcome. Please submit your pull requests or open issues to propose changes or report bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
