export const signup = async (req, res, next) => {
    const user = await signupService(req.body);
    res.status(201).json({ success: true, user })
};

export const login = async (req, res, next) => {
    try {

    } catch (error) {

    }
};

export const logout = async (req, res, next) => {
    try {

    } catch (error) {

    }
};
