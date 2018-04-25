const bcrypt = require('bcrypt');

module.exports = function (BackofficeAccountModel) {
    return {
        async addAccount(account) {
            return await addAccount(BackofficeAccountModel, account);
        },
        async getAccounts() {
            return await getAccounts(BackofficeAccountModel);
        },
        async getAccountByUsernameAndPassword(username, password) {
            return await getAccountByUsernameAndPassword(BackofficeAccountModel, username, password);
        }
    };
};

async function addAccount(BackofficeAccountModel, account) {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    const accountToBeSaved = new BackofficeAccountModel({
        ...account,
        password: hashedPassword
    });

    const savedAccount = await accountToBeSaved.save();

    return {
        username: savedAccount.username
    };
}

async function getAccounts(BackofficeAccountModel) {
    return await BackofficeAccountModel.find({}, 'username');
}

async function getAccountByUsernameAndPassword(AccountModel, username, password) {
    const account = await AccountModel.findOne({ username });

    const isPasswordCorret = await bcrypt.compare(password, account.password);

    if (account == null || !isPasswordCorret) {
        return null;
    }
    else {
        return account;
    }
}

