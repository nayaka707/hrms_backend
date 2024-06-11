const { constants, responseFunc, responseMessage, statusCode, errorResponseFunc, successResponseFunc, models } = require('../../utils/utilsIndex')

const deleteBankDetails = async (req, res) => {
    try {
        const bankId = req.params.bankId
        if (!bankId) {
            return res.status(400).json({ status: false, message: "BankId is required" })
        }
        const bankDetail = await models.BankDetails.findByPk(bankId)
        if (!bankDetail) {
            return res.status(400).json({ status: false, message: "Bank does not exist or already deleted" })
        }
        await bankDetail.destroy()
        return res.status(200).json({ message: "Successfully deleted bank detail" })
    } catch (error) {
        console.log(error)
    }
}

module.exports = deleteBankDetails