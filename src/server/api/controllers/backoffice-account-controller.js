const mongoose = require('mongoose');
const BackofficeAccount = mongoose.model('BackofficeAccount');
const backOfficeAccountService = require('../../services/backoffice-account-service')(BackofficeAccount);

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