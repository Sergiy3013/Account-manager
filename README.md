[UA](README_UA.md) | [ENG](README.md)


***

# Account Manager

This is a project I once created for myself to conveniently store information about my accounts. You manually add services, and within each service, you add an account. 

Each account can contain a login, password, and description. The password is encrypted using a key that you enter when adding the account.

To view the password, you need to click on the account view icon (blue eye icon), enter the encryption key you used for the password, and click the checkmark. Then you will see the decrypted password if the key is entered correctly.

***

#### Installation

To install the required dependencies, run the following command in your terminal:
```shell
npm i
```
Alternatively, you can open the `_INSTALL.bat` file.

#### Usage

To start the application, run the following command in your terminal:
```shell
node index.js

```
Alternatively, you can open the `_START.bat` file.

***

#### Adding Services

- Open the Services page.
- Enter the service name (this will be its title).
- Enter the service code (it will be used as an identifier).
- Insert a link to an image (optional).
- Confirm your action by clicking the OK button.

#### Adding Accounts

- Open the Services page.
- Enter the login.
- Enter the password.
- Enter the encryption key for the password.
- Add a comment if necessary.
- Confirm your action by clicking the OK button.

#### Editing Services/Accounts

- Open the list of services/accounts.
- Click on the edit icon.
- Modify the necessary data.
- Confirm your action by clicking the OK button.

#### Deleting Services/Accounts

- Open the list of services/accounts.
- Click on the delete icon.
- Confirm your action by clicking the OK button.
