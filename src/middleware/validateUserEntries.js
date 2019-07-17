const validateUserEntries = (req, res, next) => {
    const updates = Object.keys(req.body);
    const validUpdates = ['name', 'email', 'password'];
    const isValid = updates.every((update) => {
        return validUpdates.includes(update);
    });
    if(!isValid) {
        return res.status(400).send({error: "invalid update entries"});
    }
    next();
}

module.exports = validateUserEntries;