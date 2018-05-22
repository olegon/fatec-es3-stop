const mongoose = require('mongoose');
const BackofficeAccount = mongoose.model('BackofficeAccount');
const backOfficeAccountService = require('../../services/backoffice-account-service')(BackofficeAccount);


(async () => {
    const accounts = await backOfficeAccountService.getAccounts();

    console.log('Accounts found: ', accounts);

    if (!accounts.map(account => account.username).includes('admin')) {
        console.log('Adding admin acount.');

        await backOfficeAccountService.addAccount({
            username: 'admin',
            password: '$es3'
        });
    }
})();


exports.get = async (req, res, next) => {
    try {
        const accounts = await backOfficeAccountService.getAccounts();
        
        res.status(200).json(accounts);
        
        next();
    }
    catch (err) {
        res.status(500).json(err);
        next(err);
    }
}

exports.post = async (req, res, next) => {
    try {
        const { username } = req.body;
        const account = await backOfficeAccountService.addAccount(req.body);
        res.status(200).json({ username });
        next();
    }
    catch (err) {
        res.status(500).json(err);
        next(err);
    }
}