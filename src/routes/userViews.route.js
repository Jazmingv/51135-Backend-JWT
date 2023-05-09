import { Router } from 'express';
import { authToken } from '../utils.js';

const UserViewsRouter = Router();

UserViewsRouter.get('/login', (req, res) => {
    res.render("login");
})

UserViewsRouter.get('/logingithub', (req, res) => {
    res.render("loginGithub");
})

UserViewsRouter.get('/register', (req, res) => {
    res.render("register");
})

UserViewsRouter.get('/', authToken, (req, res) => {
    res.send({
        user: req.user
    });
})

export default UserViewsRouter;