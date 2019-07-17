const validateTaskEntries = (req, res, next) => {
    const updates = Object.keys(req.body);
    const validUpdates = ['completed', 'description'];
    const isValid = updates.every((update) => {
        return validUpdates.includes(update);
    });
    if(!isValid) {
        return res.status(400).send({error: "invalid update entries"});
    }
    console.log('valid update entries!')
    next();
}

module.exports = validateTaskEntries;