import { injectable, inject } from 'inversify';
import express, { Request, Response } from 'express';

import { UserRepository } from '../repositories/UserRepository';
import { UserFactory } from '../services/factories/UserFactory';

@injectable()
export class UserController {
  @inject(UserRepository)
  private userRepository: UserRepository;

  @inject(UserFactory)
  private userFactory: UserFactory;

  router: express.Application;

  constructor() {
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
    // this.router = express().post('/', this.create);
  }

  create = async (request: Request, response: Response): Promise<void> => {
    try {
      const { adopter, adm, name, cpfOrCnpj, birthDate, phone, email, password, picture, verification, address } =
        request.body.data;

      const user = await this.userFactory.call(
        adopter,
        adm,
        name,
        cpfOrCnpj,
        birthDate,
        phone,
        email,
        password,
        picture,
        verification,
        address
      );
      const createdUser = await this.userRepository.create(user);

      response.status(201).send({ data: createdUser });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  login = async (request: Request, response: Response): Promise<void> => {
    try {
      const { email, password } = request.body.data;

      // const user = await this.userFactory.call(email, password);
      const user = await this.userRepository.login(email, password);

      response.status(201).send({ data: user });
    } catch (e) {
      this.errorHandler(e, response);
    }
  };

  private errorHandler(e: any, response: Response): Response {
    if (e.name === 'UserExists') return response.status(409).send({ error: { detail: e.message } });

    return response.status(500).send({ error: { detail: 'Internal Server Error' } });
  }
}

export default new UserController();

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import createToken from '../middlewares/createToken';
// import bcrypt from 'bcrypt';
// import { IUserSchema, UserModel } from '../models/user';

// export default {
//   async login(req: { body: IUserSchema }, res: any) {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Dados inválidos',
//       });
//     }
//     try {
//       UserModel.findOne({ email }, (error: any, user: IUserSchema) => {
//         if (error) {
//           return res.status(400).json({
//             success: false,
//             message: 'Erro ao tentar buscar os dados',
//           });
//         }
//         if (!user) {
//           return res.status(400).json({
//             success: false,
//             message: 'Login inválido',
//           });
//         }
//         bcrypt.compare(password, String(user.password), (error, same) => {
//           if (!same) {
//             return res.status(400).json({
//               success: false,
//               message: 'Login inválido',
//             });
//           }
//           if (error) {
//             return res.status(401).json({
//               success: false,
//               message: 'Não autorizado',
//             });
//           }

//           user.password = undefined;

//           return res.status(200).json({
//             success: true,
//             message: 'Login realizado com sucesso',
//             user,
//             token: createToken(user._id),
//           });
//         });
//       }).select('+password');
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Erro ao tentar realizar o login',
//       });
//     }
//   },
//   async register(req: { body: IUserSchema }, res: any) {
//     try {
//       const user = await UserModel.create(req.body);

//       (user as IUserSchema).password = undefined;
//       return res.status(201).json({
//         success: true,
//         message: 'Usúario criado com sucesso.',
//         user,
//         token: createToken(String(user._id)),
//       });
//     } catch (error) {
//       return res.status(400).json({
//         success: false,
//         message: 'Erro ao tentar criar o usúario.',
//         error,
//       });
//     }
//   },
// };
