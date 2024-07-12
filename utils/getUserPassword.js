const getUserPassword = async (req, res) => {
    try {
userId= req.user.id

        const response = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!response) {
            throw new Error('User not found');
        }

        return response.password;
    } catch (error) {
        console.error('Error fetching user password:', error);
        throw error;
    }
};


module.exports = {
    getUserPassword
}