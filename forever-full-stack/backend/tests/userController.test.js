import { loginUser, registerUser, adminLogin } from '../controllers/userController.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

jest.mock('../models/userModel.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('validator');

describe('User Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    jest.clearAllMocks();
  });

  // registerUser tests
  it('should register a user successfully', async () => {
    req.body = { name: 'JohnDoe', email: 'john@example.com', password: 'strongpass123' };
    userModel.findOne.mockResolvedValue(null);
    validator.isEmail.mockReturnValue(true);
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hashedPass');
    userModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue({ _id: 'abc123' }) }));
    jwt.sign.mockReturnValue('token123');

    await registerUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, token: 'token123' });
  });

  it('should fail registration if user already exists', async () => {
    req.body = { email: 'existing@example.com' };
    userModel.findOne.mockResolvedValue({});

    await registerUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'User already exists' });
  });

  it('should reject invalid email format', async () => {
    req.body = { email: 'invalid-email', password: '12345678', name: 'John' };
    userModel.findOne.mockResolvedValue(null);
    validator.isEmail.mockReturnValue(false);

    await registerUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Please enter a valid email' });
  });

  it('should reject weak password', async () => {
    req.body = { email: 'test@example.com', password: '123', name: 'John' };
    userModel.findOne.mockResolvedValue(null);
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Please enter a strong password' });
  });

  it('should reject name shorter than 3 chars or longer than 15', async () => {
    req.body = { email: 'test@example.com', password: '12345678', name: 'Jo' };
    userModel.findOne.mockResolvedValue(null);
    validator.isEmail.mockReturnValue(true);

    await registerUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Name must be between 3 and 15 characters' });
  });

  // loginUser tests
  it('should login successfully', async () => {
    req.body = { email: 'john@example.com', password: 'pass123' };
    const user = { _id: 'user123', password: 'hashedPass' };
    userModel.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token123');

    await loginUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, token: 'token123' });
  });

  it('should reject invalid credentials', async () => {
    req.body = { email: 'john@example.com', password: 'wrong' };
    userModel.findOne.mockResolvedValue({ password: 'hashed' });
    bcrypt.compare.mockResolvedValue(false);

    await loginUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
  });

  it('should handle user not found', async () => {
    req.body = { email: 'notfound@example.com', password: 'pass123' };
    userModel.findOne.mockResolvedValue(null);

    await loginUser(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "User doesn't exists" });
  });

  // adminLogin tests
  it('should login admin successfully', async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_PASSWORD = 'adminpass';
    req.body = { email: 'admin@example.com', password: 'adminpass' };
    jwt.sign.mockReturnValue('admintoken');

    await adminLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, token: 'admintoken' });
  });

  it('should reject invalid admin credentials', async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_PASSWORD = 'adminpass';
    req.body = { email: 'admin@example.com', password: 'wrongpass' };

    await adminLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid credentials' });
  });
});
