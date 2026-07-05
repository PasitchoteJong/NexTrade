export function register(req, res) {
    res.send('Register Controller')
}

export function login(req, res) {
    res.send({
        message: 'Login Controller',
        body: req.body
    })
}

export function getMe(req, res) {
    res.send('Get me Controller')
}